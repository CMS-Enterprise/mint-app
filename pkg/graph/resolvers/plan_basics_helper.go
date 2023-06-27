package resolvers

import (
	"time"

	"github.com/mitchellh/mapstructure"

	"github.com/cmsgov/mint-app/pkg/models"
)

type dateChange struct {
	Old, New, OldRangeStart, OldRangeEnd, NewRangeStart, NewRangeEnd *time.Time
}

// DateProcessor is a struct that processes date changes
type DateProcessor struct {
	changes  map[string]interface{}
	existing map[string]interface{}
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
		return nil, err
	}

	return &DateProcessor{changes: changes, existing: existingMap}, nil
}

// ExtractChangedDates extracts the changed dates from the DateProcessor
func (dp *DateProcessor) ExtractChangedDates() (map[string]dateChange, error) {
	dateFields := getDateFieldsToCheck()

	dateChanges := make(map[string]dateChange)

	for _, field := range dateFields {
		isFieldChanged, oldValue, newValue := dp.checkDateFieldChanged(field)
		if isFieldChanged {
			dateChanges[field] = dateChange{
				Old: oldValue,
				New: newValue,
				// Initialize ranges as nil by default
				OldRangeStart: nil,
				OldRangeEnd:   nil,
				NewRangeStart: nil,
				NewRangeEnd:   nil,
			}
		}
	}

	return dateChanges, nil
}

func (dp *DateProcessor) checkDateFieldChanged(field string) (bool, *time.Time, *time.Time) {
	newVal, newExists := dp.changes[field]
	oldVal, oldExists := dp.existing[field]

	if newExists && oldExists {
		var newTimeVal time.Time
		var err error
		switch v := newVal.(type) {
		case time.Time:
			newTimeVal = v
		case string:
			newTimeVal, err = time.Parse(time.RFC3339, v)
			if err != nil {
				return false, nil, nil
			}
		default:
			return false, nil, nil
		}

		oldTimeVal, isTypeAssertionOk := oldVal.(*time.Time)
		if !isTypeAssertionOk {
			return false, nil, nil
		}

		if oldTimeVal == nil || !newTimeVal.Equal(*oldTimeVal) {
			return true, oldTimeVal, &newTimeVal
		}
	}
	return false, nil, nil
}

func getDateFieldsToCheck() []string {
	dateFields := []string{
		"completeICIP",
		"clearanceStarts",
		"clearanceEnds",
		"announced",
		"applicationsStart",
		"applicationsEnd",
		"performancePeriodStarts",
		"performancePeriodEnds",
		"wrapUpEnds",
	}
	return dateFields
}
