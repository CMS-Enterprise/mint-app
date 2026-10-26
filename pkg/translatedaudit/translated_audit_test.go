// Package translatedaudit translates audit delta slices to human readable changes
package translatedaudit

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/mappings"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func TestTranslateAuditsForModelPlan(t *testing.T) {
	//This happens in the resolver package for simplicity, as it really needs to be an integration test

}

func TestTranslateField(t *testing.T) {
	// Tests if a translation doesn't exist, what is returned
	// Test if a translation does exist, what is returned?

	// SEE TestTranslationFieldLabel

	testBaseLabel := "Hooray Base Label"
	testReadOnlyLabel := "Hooray ReadOnly Label"
	testSubLabel := "Hooray Sub Label"

	translationFieldKey := "translation_field_key"

	otherParentField := "parent_field_db_struct_label"
	parentLabel := "Hooray, you got the label from the parent"

	testAuditField := models.AuditField{
		Old: "Hello",
		New: "Why, Hello There.",
	}
	testAuditChange := models.AuditChange{
		ID: 1,
	}

	testTranslation := models.TranslationField{
		TranslationFieldBase: models.TranslationFieldBase{

			Label:                 testBaseLabel,
			ReadOnlyLabel:         &testReadOnlyLabel,
			SubLabel:              &testSubLabel,
			MultiSelectLabel:      nil,
			IsArray:               false,
			DataType:              models.TDTString,
			FormType:              models.TFTText,
			IsNote:                false,
			IsOtherType:           false,
			OtherParentField:      &otherParentField,
			ParentReferencesLabel: nil,
			ExportLabel:           nil,
		},
	}

	parentTranslationTest := models.TranslationField{
		TranslationFieldBase: models.TranslationFieldBase{
			DBField: otherParentField,

			Label:                 parentLabel,
			ReadOnlyLabel:         nil,
			SubLabel:              nil,
			MultiSelectLabel:      nil,
			IsArray:               false,
			DataType:              models.TDTString,
			FormType:              models.TFTText,
			IsNote:                false,
			IsOtherType:           false,
			OtherParentField:      nil,
			ParentReferencesLabel: nil,
		},
	}

	testTranslationMap := map[string]models.ITranslationField{
		translationFieldKey: testTranslation,
		otherParentField:    parentTranslationTest,
	}

	ctx := context.Background()

	t.Run("Form Type is present when there is a translation", func(t *testing.T) {
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(ctx, store, translationFieldKey, testAuditField, &testAuditChange, models.DBOpUpdate, testTranslationMap)
		assert.True(t, wasTranslated)
		assert.NoError(t, err)
		assert.NotNil(t, translatedField.FormType)
		assert.NotNil(t, translatedField.DataType)

		assert.EqualValues(t, testTranslation.FormType, translatedField.FormType)

		assert.EqualValues(t, testTranslation.DataType, translatedField.DataType)

	})

	t.Run("When there is not a translation, there is no translation field ", func(t *testing.T) {
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(ctx, store, "there is no translation for this", testAuditField, &testAuditChange, models.DBOpUpdate, testTranslationMap)
		assert.False(t, wasTranslated)
		assert.Nil(t, (translatedField))
		assert.NoError(t, err)

	})

	t.Run("When a field is unchanged, there is no translation field ", func(t *testing.T) {
		unchangedAuditField := models.AuditField{
			Old: nil,
			New: "{}",
		}
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(ctx, store, "there is no translation for this", unchangedAuditField, &testAuditChange, models.DBOpUpdate, testTranslationMap)
		assert.False(t, wasTranslated)
		assert.Nil(t, (translatedField))
		assert.NoError(t, err)

	})
	t.Run("When a field is changed to empty string, there is no translation field ", func(t *testing.T) {
		unchangedAuditField := models.AuditField{
			Old: nil,
			New: "",
		}
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(ctx, store, "there is no translation for this", unchangedAuditField, &testAuditChange, models.DBOpUpdate, testTranslationMap)
		assert.False(t, wasTranslated)
		assert.Nil(t, (translatedField))
		assert.NoError(t, err)

	})
	t.Run("When a field is changed from empty string to nil, there is no translation field ", func(t *testing.T) {
		unchangedAuditField := models.AuditField{
			Old: "",
			New: nil,
		}
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(ctx, store, "there is no translation for this", unchangedAuditField, &testAuditChange, models.DBOpUpdate, testTranslationMap)
		assert.False(t, wasTranslated)
		assert.Nil(t, (translatedField))
		assert.NoError(t, err)

	})

}

func TestTranslateFieldNotApplicableQuestionsByTable(t *testing.T) {
	tests := []struct {
		name      string
		tableName models.TableName
		fieldName string
		want      bool
	}{
		{name: "waiver assessment survey", tableName: models.TNWaiverAssessmentSurvey, fieldName: "modifies_medicare_savings_programs", want: false},
		{name: "IDDOC questionnaire", tableName: models.TNIddocQuestionnaire, fieldName: "needed", want: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			translation, err := mappings.GetTranslation(tt.tableName)
			if !assert.NoError(t, err) {
				return
			}
			translationMap, err := translation.ToMap()
			if !assert.NoError(t, err) {
				return
			}
			if !assert.Contains(t, translationMap, tt.fieldName) {
				return
			}
			children, hasChildren := translationMap[tt.fieldName].GetChildren()
			assert.True(t, hasChildren)
			assert.NotEmpty(t, children["true"])

			audit := &models.AuditChange{TableName: tt.tableName}
			field, translated, err := translateField(
				context.Background(), nil, tt.fieldName,
				models.AuditField{Old: "true", New: "false"},
				audit, models.DBOpUpdate, translationMap,
			)
			assert.NoError(t, err)
			if !assert.True(t, translated) || !assert.NotNil(t, field) {
				return
			}
			if tt.want {
				if assert.NotNil(t, field.NotApplicableQuestions) {
					assert.NotEmpty(t, *field.NotApplicableQuestions)
				}
			} else {
				assert.Nil(t, field.NotApplicableQuestions)
			}
		})
	}
}

func TestGetChangeType(t *testing.T) {
	var old interface{}
	new := "{}"
	ct := getChangeType(old, new)
	assert.EqualValues(t, models.AFCUnchanged, ct)

	new = "hello"
	ct = getChangeType(old, new)
	assert.EqualValues(t, models.AFCAnswered, ct)

	old = "hello"
	new = "hello again"
	ct = getChangeType(old, new)
	assert.EqualValues(t, models.AFCUpdated, ct)

	old = "hello again"
	var nilNew interface{}
	ct = getChangeType(old, nilNew)
	assert.EqualValues(t, models.AFCRemoved, ct)
}

func TestWaiverFieldLabel(t *testing.T) {
	assert.Equal(
		t,
		"Do you plan to use this waiver with your model? (Waiver: Implementation period)",
		waiverFieldLabel("Do you plan to use this waiver with your model?", "Implementation period"),
	)
}

func TestIsWaiverSelectionField(t *testing.T) {
	assert.True(t, isWaiverSelectionField(models.TNWaiver, "will_use_waiver"))
	assert.False(t, isWaiverSelectionField(models.TNWaiver, "using_reason"))
	assert.False(t, isWaiverSelectionField(models.TNWaiver, "not_using_reason"))
	assert.False(t, isWaiverSelectionField(models.TNWaiverAssessmentSurvey, "will_use_waiver"))
}

func TestWaiverNameLookupIsNeededForWaiverHistoryFields(t *testing.T) {
	audit := &models.AuditChangeWithModelPlanID{
		AuditChange: models.AuditChange{
			TableName: models.TNWaiver,
			Fields: models.AuditFields{
				"will_use_waiver": {Old: "t", New: "f"},
			},
		},
	}

	_, err := getWaiverNameForAudit(nil, audit)
	assert.ErrorContains(t, err, "store was nil")

	audit.Fields = models.AuditFields{"not_using_reason": {Old: nil, New: "Not needed"}}
	_, err = getWaiverNameForAudit(nil, audit)
	assert.ErrorContains(t, err, "store was nil")

	audit.Fields = models.AuditFields{"using_reason": {Old: nil, New: "Needed"}}
	_, err = getWaiverNameForAudit(nil, audit)
	assert.ErrorContains(t, err, "store was nil")

	audit.Fields = models.AuditFields{}
	name, err := getWaiverNameForAudit(nil, audit)
	assert.NoError(t, err)
	assert.Empty(t, name)
}

func TestTranslateWaiverDecisionAndReason(t *testing.T) {
	translation, err := mappings.WaiverTranslation()
	if !assert.NoError(t, err) {
		return
	}
	translationMap, err := translation.ToMap()
	if !assert.NoError(t, err) {
		return
	}

	audit := &models.AuditChange{TableName: models.TNWaiver}
	decision, translated, err := translateField(
		context.Background(), nil, "will_use_waiver",
		models.AuditField{Old: "t", New: "f"}, audit, models.DBOpUpdate, translationMap,
	)
	assert.NoError(t, err)
	if !assert.True(t, translated) || !assert.NotNil(t, decision) {
		return
	}
	assert.Equal(t, models.AFCUpdated, decision.ChangeType)
	assert.Equal(t, "Yes", decision.OldTranslated)
	assert.Equal(t, "No", decision.NewTranslated)
	assert.Equal(t, "Do you plan to use this waiver with your model?", decision.FieldNameTranslated)

	reason, translated, err := translateField(
		context.Background(), nil, "not_using_reason",
		models.AuditField{Old: nil, New: "The waiver is not needed."}, audit, models.DBOpUpdate, translationMap,
	)
	assert.NoError(t, err)
	if !assert.True(t, translated) || !assert.NotNil(t, reason) {
		return
	}
	assert.Equal(t, models.AFCAnswered, reason.ChangeType)
	assert.Equal(t, "Please explain why your model is not using this waiver.", reason.FieldNameTranslated)
	assert.Equal(t, "The waiver is not needed.", reason.NewTranslated)
}

func TestWaiverAssessmentSurveyReasonHistoryLabels(t *testing.T) {
	tests := []struct {
		name      string
		fields    models.AuditFields
		fieldName string
		wantLabel string
	}{
		{
			name: "example changed without Yes/No answer",
			fields: models.AuditFields{
				"bundles_payments_example": {Old: "first example", New: "second example"},
			},
			fieldName: "bundles_payments_example",
			wantLabel: "Please provide an example (Does your model bundle payments?)",
		},
		{
			name: "reason changed without Yes/No answer",
			fields: models.AuditFields{
				"modifies_medicare_savings_programs_why_not": {Old: "NOT_TESTING", New: "OUT_OF_SCOPE"},
			},
			fieldName: "modifies_medicare_savings_programs_why_not",
			wantLabel: "Please explain why not (Does your model modify Medicare shared savings programs?)",
		},
		{
			name: "example changed with Yes/No answer",
			fields: models.AuditFields{
				"bundles_payments":         {Old: "false", New: "true"},
				"bundles_payments_example": {Old: nil, New: "example"},
			},
			fieldName: "bundles_payments_example",
			wantLabel: "Please provide an example",
		},
		{
			name: "reason changed with Yes/No answer",
			fields: models.AuditFields{
				"bundles_payments":         {Old: "true", New: "false"},
				"bundles_payments_why_not": {Old: nil, New: "OUT_OF_SCOPE"},
			},
			fieldName: "bundles_payments_why_not",
			wantLabel: "Please explain why not",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			audit := &models.AuditChangeWithModelPlanID{
				AuditChange: models.AuditChange{
					TableName: models.TNWaiverAssessmentSurvey,
					Action:    "U",
					Fields:    tt.fields,
				},
			}
			translated, err := genericAuditTranslation(context.Background(), nil, audit)
			if !assert.NoError(t, err) {
				return
			}
			for _, field := range translated.TranslatedFields {
				if field.FieldName == tt.fieldName {
					assert.Equal(t, tt.wantLabel, field.FieldNameTranslated)
					return
				}
			}
			t.Errorf("translated field %q not found", tt.fieldName)
		})
	}
}
