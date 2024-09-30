package resolvers

import (
	"fmt"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"

	"github.com/mitchellh/mapstructure"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

type dateFieldData struct {
	IsRange           bool
	IsRangeStart      bool
	OtherRangeKey     string
	CommonKey         string // Used to tether data between two ends of a date range, nil or empty for single dates
	HumanReadableName string
}

// DateProcessor is a struct that processes date changes
type DateProcessor struct {
	changes      map[string]interface{}
	existing     map[string]interface{}
	FieldDataMap map[string]dateFieldData
}

// NewDateProcessor is a constructor for DateProcessor
func NewDateProcessor(changes map[string]interface{}, existing *models.PlanBasics) (*DateProcessor, error) {
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

	return &DateProcessor{changes: changes, existing: existingMap}, nil
}

func copyTime(t *time.Time) *time.Time {
	if t != nil {
		copyData := new(time.Time)
		*copyData = *t
		return copyData
	}
	return nil
}

// ExtractChangedDates extracts the changed dates from the DateProcessor
func (dp *DateProcessor) ExtractChangedDates() (map[string]email.DateChange, error) {
	fieldDataMap := getFieldDataMap()

	dateChanges := make(map[string]email.DateChange)

	for fieldKey, fieldData := range fieldDataMap {
		isFieldChanged, oldValue, newValue := dp.checkDateFieldChanged(fieldKey)
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
				isOtherFieldChanged, otherOldValue, otherNewValue := dp.checkDateFieldChanged(fieldData.OtherRangeKey)
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
					dateChangeValue.OldRangeStart = copyTime(oldValue)
					dateChangeValue.NewRangeStart = copyTime(newValue)
					dateChangeValue.OldRangeEnd = copyTime(otherOldValue)
					dateChangeValue.NewRangeEnd = copyTime(otherNewValue)
				} else {
					dateChangeValue.OldRangeEnd = copyTime(oldValue)
					dateChangeValue.NewRangeEnd = copyTime(newValue)
					dateChangeValue.OldRangeStart = copyTime(otherOldValue)
					dateChangeValue.NewRangeStart = copyTime(otherNewValue)
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
					OldDate:   copyTime(oldValue),
					NewDate:   copyTime(newValue),
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
					dateChange.OldRangeStart = copyTime(dp.existing[fieldKey].(*time.Time))
				} else {
					dateChange.OldRangeStart = nil
				}

				if dp.existing[fieldKey] != nil {
					dateChange.OldRangeEnd = copyTime(dp.existing[fieldData.OtherRangeKey].(*time.Time))
				} else {
					dateChange.OldRangeEnd = nil
				}
			} else {
				if dp.existing[fieldKey] != nil {
					dateChange.OldDate = copyTime(dp.existing[fieldKey].(*time.Time))
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
func (dp *DateProcessor) checkDateFieldChanged(field string) (
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
func getFieldDataMap() map[string]dateFieldData {
	fieldData := map[string]dateFieldData{
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

func getOrderedCommonKeys() []string {
	return []string{
		"completeICIP",
		"clearance",
		"announced",
		"applications",
		"performancePeriod",
		"wrapUpEnds",
	}
}
