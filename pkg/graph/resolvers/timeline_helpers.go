package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/mitchellh/mapstructure"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

type dateTimelineFieldData struct {
	IsRange           bool
	IsRangeStart      bool
	OtherRangeKey     string
	CommonKey         string // Used to tether data between two ends of a date range, nil or empty for single dates
	HumanReadableName string
}

// TimelineDateProcessor is a struct that processes date changes
type TimelineDateProcessor struct {
	changes      map[string]interface{}
	existing     map[string]interface{}
	FieldDataMap map[string]dateTimelineFieldData
}

// NewTimelineDateProcessor is a constructor for TimelineDateProcessor
func NewTimelineDateProcessor(changes map[string]interface{}, existing *models.Timeline) (*TimelineDateProcessor, error) {
	var existingMap map[string]interface{}
	decoderConfig := &mapstructure.DecoderConfig{
		Result:           &existingMap,
		TagName:          "json",
		WeaklyTypedInput: true,
	}

	decoder, err := mapstructure.NewDecoder(decoderConfig)
	if err != nil {
		return nil, err
	}

	err = decoder.Decode(existing)
	if err != nil {
		fmt.Printf("Decode error: %v\n", err)
		return nil, err
	}

	return &TimelineDateProcessor{changes: changes, existing: existingMap}, nil
}

func copyTimelineTime(t *time.Time) *time.Time {
	if t != nil {
		copyData := new(time.Time)
		*copyData = *t
		return copyData
	}
	return nil
}

// ExtractTimelineChangedDates extracts the changed dates from the TimelineDateProcessor
func (dp *TimelineDateProcessor) ExtractTimelineChangedDates() (map[string]email.DateChange, error) {
	fieldDataMap := getTimelineFieldDataMap()

	dateChanges := make(map[string]email.DateChange)

	for fieldKey, fieldData := range fieldDataMap {
		isFieldChanged, oldValue, newValue := dp.checkTimelineDateFieldChanged(fieldKey)
		if isFieldChanged {
			if fieldData.IsRange { // check if the field is a range
				if _, foundExistingDCV := dateChanges[fieldData.CommonKey]; foundExistingDCV {
					continue
				}

				dateChangeValue := &email.DateChange{
					IsChanged: true,
					Field:     fieldData.HumanReadableName,
					IsRange:   true,
				}

				// Determine the values for the other end of the range
				isOtherFieldChanged, otherOldValue, otherNewValue := dp.checkTimelineDateFieldChanged(fieldData.OtherRangeKey)
				if !isOtherFieldChanged {
					existingData, existingDataFound := dp.existing[fieldData.OtherRangeKey]
					otherNewData, newFound := dp.changes[fieldData.OtherRangeKey]

					if existingDataFound {
						otherOldValue = existingData.(*time.Time)
						if newFound {
							if otherNewData != nil {
								otherNewValueParsed, err := time.Parse(time.RFC3339, otherNewData.(string))
								otherNewValue = &otherNewValueParsed
								if err != nil {
									return nil, err
								}

								if otherNewValue.IsZero() {
									otherNewValue = nil
								}
							}
						} else {
							otherNewValue = otherOldValue
						}
					} else {
						otherOldValue = nil
						otherNewValue = nil
					}
				}

				if fieldData.IsRangeStart {
					dateChangeValue.OldRangeStart = copyTimelineTime(oldValue)
					dateChangeValue.NewRangeStart = copyTimelineTime(newValue)
					dateChangeValue.OldRangeEnd = copyTimelineTime(otherOldValue)
					dateChangeValue.NewRangeEnd = copyTimelineTime(otherNewValue)
				} else {
					dateChangeValue.OldRangeEnd = copyTimelineTime(oldValue)
					dateChangeValue.NewRangeEnd = copyTimelineTime(newValue)
					dateChangeValue.OldRangeStart = copyTimelineTime(otherOldValue)
					dateChangeValue.NewRangeStart = copyTimelineTime(otherNewValue)
				}

				if fieldData.CommonKey == "" {
					return nil, fmt.Errorf("CommonKey cannot be empty for range fields")
				}

				dateChanges[fieldData.CommonKey] = *dateChangeValue
			} else {
				dateChanges[fieldKey] = email.DateChange{
					IsChanged: true,
					Field:     fieldData.HumanReadableName,
					IsRange:   false,
					OldDate:   copyTimelineTime(oldValue),
					NewDate:   copyTimelineTime(newValue),
				}
			}
		}
	}

	if len(dateChanges) == 0 {
		return dateChanges, nil
	}

	for fieldKey, fieldData := range fieldDataMap {
		if _, isChanged := dateChanges[fieldData.CommonKey]; !isChanged {
			// Only handle start of range in range dates to simplify logic
			if fieldData.IsRange && !fieldData.IsRangeStart {
				continue
			}

			dateChange := email.DateChange{
				IsChanged: false,
				Field:     fieldData.HumanReadableName,
				IsRange:   fieldData.IsRange,
			}

			if fieldData.IsRange {
				if dp.existing[fieldKey] != nil {
					dateChange.OldRangeStart = copyTimelineTime(dp.existing[fieldKey].(*time.Time))
				} else {
					dateChange.OldRangeStart = nil
				}

				if dp.existing[fieldKey] != nil {
					dateChange.OldRangeEnd = copyTimelineTime(dp.existing[fieldData.OtherRangeKey].(*time.Time))
				} else {
					dateChange.OldRangeEnd = nil
				}
			} else {
				if dp.existing[fieldKey] != nil {
					dateChange.OldDate = copyTimelineTime(dp.existing[fieldKey].(*time.Time))
				} else {
					dateChange.OldDate = nil
				}
			}

			dateChanges[fieldData.CommonKey] = dateChange
		}
	}

	return dateChanges, nil
}

// Returns:
//  1. Boolean: true if the field has changed
//  2. *time.Time: Old value of the field converted to a pointer to a time.Time
//  3. *time.Time: New value of the field converted to a pointer to a time.Time
func (dp *TimelineDateProcessor) checkTimelineDateFieldChanged(field string) (
	bool,
	*time.Time,
	*time.Time,
) {
	newVal, newExists := dp.changes[field]
	oldVal, oldExists := dp.existing[field]
	var newTimeVal, oldTimeVal *time.Time
	hasAssignedNewValue := false

	// If we are assigning a new value then we have a change
	if newExists {
		hasAssignedNewValue = true

		if newVal != nil {
			switch v := newVal.(type) {
			case string:
				newTimeParsed, err := time.Parse(time.RFC3339, v)
				if err != nil {
					return false, nil, nil
				}

				if !newTimeParsed.IsZero() {
					newTimeVal = &newTimeParsed
				}
			default:
				return false, nil, nil
			}
		}
	}

	var ok bool
	if oldExists && oldVal != nil {
		oldTimeVal, ok = oldVal.(*time.Time)
		if !ok || (oldTimeVal != nil && oldTimeVal.IsZero()) {
			oldTimeVal = nil
		}
	}

	// If we have not assigned a new value then we should default to using the old value
	if !hasAssignedNewValue {
		return false, oldTimeVal, oldTimeVal
	}

	bothTimesAreNil := oldTimeVal == nil && newTimeVal == nil
	neitherTimeIsNil := oldTimeVal != nil && newTimeVal != nil

	// If we are assigning the same value as that which already exists we should not
	if bothTimesAreNil || (neitherTimeIsNil && (*newTimeVal).Equal(*oldTimeVal)) {
		return false, oldTimeVal, oldTimeVal
	}

	return true, oldTimeVal, newTimeVal
}

// TODO: How can this be simplified using struct tags?
func getTimelineFieldDataMap() map[string]dateTimelineFieldData {
	fieldData := map[string]dateTimelineFieldData{
		"completeICIP": {
			HumanReadableName: "Complete ICIP",
			IsRange:           false,
			CommonKey:         "completeICIP",
		},
		"clearanceStarts": {
			HumanReadableName: "Clearance",
			IsRange:           true,
			IsRangeStart:      true,
			OtherRangeKey:     "clearanceEnds",
			CommonKey:         "clearance",
		},
		"clearanceEnds": {
			HumanReadableName: "Clearance",
			IsRange:           true,
			IsRangeStart:      false,
			OtherRangeKey:     "clearanceStarts",
			CommonKey:         "clearance",
		},
		"announced": {
			HumanReadableName: "Announce model",
			IsRange:           false,
			CommonKey:         "announced",
		},
		"applicationsStart": {
			HumanReadableName: "Application period",
			IsRange:           true,
			IsRangeStart:      true,
			OtherRangeKey:     "applicationsEnd",
			CommonKey:         "applications",
		},
		"applicationsEnd": {
			HumanReadableName: "Application period",
			IsRange:           true,
			IsRangeStart:      false,
			OtherRangeKey:     "applicationsStart",
			CommonKey:         "applications",
		},
		"performancePeriodStarts": {
			HumanReadableName: "Performance period",
			IsRange:           true,
			IsRangeStart:      true,
			OtherRangeKey:     "performancePeriodEnds",
			CommonKey:         "performancePeriod",
		},
		"performancePeriodEnds": {
			HumanReadableName: "Performance period",
			IsRange:           true,
			IsRangeStart:      false,
			OtherRangeKey:     "performancePeriodStarts",
			CommonKey:         "performancePeriod",
		},
		"wrapUpEnds": {
			HumanReadableName: "Model wrap-up end date",
			IsRange:           false,
			CommonKey:         "wrapUpEnds",
		},
	}
	return fieldData
}

func getTimelineOrderedCommonKeys() []string {
	return []string{
		"completeICIP",
		"clearance",
		"announced",
		"applications",
		"performancePeriod",
		"wrapUpEnds",
	}
}

func processTimelineChangedDates(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	changes map[string]interface{},
	existing *models.Timeline,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
) error {
	dateChanges, err := extractTimelineChangedDates(changes, existing)
	if err != nil {
		return err
	}

	if len(dateChanges) > 0 {
		go func() {
			err2 := sendTimelineDateChangedEmails(
				ctx,
				logger,
				store,
				principal,
				emailService,
				emailTemplateService,
				addressBook,
				modelPlan,
				dateChanges,
			)

			if err2 != nil {
				logger.Error("Failed to send email notification",
					zap.Error(err),
					zap.String("modelPlanID", modelPlan.ID.String()),
				)
			}
		}()
	}
	return nil
}
func extractTimelineChangedDates(changes map[string]interface{}, existing *models.Timeline) (
	map[string]email.DateChange,
	error,
) {
	dp, err := NewTimelineDateProcessor(changes, existing)
	if err != nil {
		return nil, err
	}

	dateChanges, err := dp.ExtractTimelineChangedDates()
	if err != nil {
		return nil, err
	}

	return dateChanges, nil
}
func sanitizeTimelineZeroDate(date *time.Time) *time.Time {
	if date == nil {
		return nil
	}
	if date.IsZero() {
		return nil
	}

	return date
}
func sendTimelineDateChangedEmails(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	dateChanges map[string]email.DateChange,
) error {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanDateChangedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanDateChangedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	dateChangeSlice := make([]email.DateChange, 0, len(dateChanges))

	// Loop over the field data map to ensure order of the date changes in the email
	orderedCommonKeys := getTimelineOrderedCommonKeys()
	for _, commonKey := range orderedCommonKeys {
		dateChange := dateChanges[commonKey]

		dateChange.OldDate = sanitizeTimelineZeroDate(dateChange.OldDate)
		dateChange.NewDate = sanitizeTimelineZeroDate(dateChange.NewDate)
		dateChange.OldRangeStart = sanitizeTimelineZeroDate(dateChange.OldRangeStart)
		dateChange.NewRangeStart = sanitizeTimelineZeroDate(dateChange.NewRangeStart)
		dateChange.OldRangeEnd = sanitizeTimelineZeroDate(dateChange.OldRangeEnd)
		dateChange.NewRangeEnd = sanitizeTimelineZeroDate(dateChange.NewRangeEnd)

		dateChangeSlice = append(dateChangeSlice, dateChange)
	}

	defaultRecipientEmailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
		ShowFooter:    false,
	})
	if err != nil {
		return err
	}

	// Send the email to default recipients
	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		defaultRecipientEmailBody,
	)
	if err != nil {
		return err
	}

	recipientUserAccounts, err := store.UserAccountsGetNotificationRecipientsForDatesChanged(modelPlan.ID)
	if err != nil {
		logger.Error("Error getting user accounts for date change notifications",
			zap.Error(err),
			zap.String("modelPlanID", modelPlan.ID.String()),
		)
		return err
	}

	emailRecipientUserAccounts, inAppRecipientUserAccounts := models.FilterNotificationPreferences(recipientUserAccounts)

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
		ShowFooter:    true,
	})
	if err != nil {
		return err
	}

	recipientEmails := lo.Map(emailRecipientUserAccounts, func(user *models.UserAccountAndNotificationPreferences, _ int) string {
		return user.Email
	})

	go func() {
		err = emailService.Send(
			addressBook.DefaultSender,
			nil,
			nil,
			emailSubject,
			"text/html",
			emailBody,
			oddmail.WithBCC(recipientEmails),
		)

		if err != nil {
			logger.Error("Failed to send email notification",
				zap.Error(err),
				zap.String("modelPlanID", modelPlan.ID.String()),
			)
		}
	}()

	// Convert from email.DateChange to models.DateChange for GQL transport
	datesChangedModels := lo.Map(dateChangeSlice, func(dc email.DateChange, _ int) models.DateChange {
		modelDateChange := models.DateChange{
			IsChanged:     dc.IsChanged,
			IsRange:       dc.IsRange,
			OldDate:       dc.OldDate,
			NewDate:       dc.NewDate,
			OldRangeStart: dc.OldRangeStart,
			OldRangeEnd:   dc.OldRangeEnd,
			NewRangeStart: dc.NewRangeStart,
			NewRangeEnd:   dc.NewRangeEnd,
		}

		switch dc.Field {
		case "Complete ICIP":
			modelDateChange.Field = models.DateChangeFieldTypeCompleteIcip
		case "Clearance":
			modelDateChange.Field = models.DateChangeFieldTypeClearance
		case "Announce model":
			modelDateChange.Field = models.DateChangeFieldTypeAnnounced
		case "Application period":
			modelDateChange.Field = models.DateChangeFieldTypeApplications
		case "Performance period":
			modelDateChange.Field = models.DateChangeFieldTypePerformancePeriod
		case "Model wrap-up end date":
			modelDateChange.Field = models.DateChangeFieldTypeWrapUpEnds
		default:
			logger.Error("Unknown field type", zap.String("field", dc.Field))
		}

		return modelDateChange
	})

	_, err = notifications.ActivityDatesChangedCreate(ctx, store, principal.Account().ID, modelPlan.ID, datesChangedModels, inAppRecipientUserAccounts)
	if err != nil {
		return err
	}

	return nil
}

func getUpcomingTimelineDate(timeline *models.Timeline) (*time.Time, error) {
	now := time.Now()
	var nearest *time.Time

	dateFields := []*time.Time{
		timeline.CompleteICIP,
		timeline.ClearanceStarts,
		timeline.ClearanceEnds,
		timeline.Announced,
		timeline.ApplicationsStart,
		timeline.ApplicationsEnd,
		timeline.PerformancePeriodStarts,
		timeline.PerformancePeriodEnds,
		timeline.WrapUpEnds,
	}

	for _, dt := range dateFields {
		if dt != nil && dt.After(now) {
			if nearest == nil || dt.Before(*nearest) {
				nearest = dt
			}
		}
	}

	return nearest, nil
}
