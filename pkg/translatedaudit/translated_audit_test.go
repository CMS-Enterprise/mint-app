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

func TestWaiverReasonLabel(t *testing.T) {
	assert.Equal(
		t,
		"Please explain why your model is not using this waiver. (Waiver: Implementation period)",
		waiverReasonLabel("Please explain why your model is not using this waiver.", "Implementation period"),
	)
}

func TestIsWaiverReasonField(t *testing.T) {
	assert.True(t, isWaiverReasonField(models.TNWaiver, "using_reason"))
	assert.True(t, isWaiverReasonField(models.TNWaiver, "not_using_reason"))
	assert.False(t, isWaiverReasonField(models.TNWaiverAssessmentSurvey, "using_reason"))
	assert.False(t, isWaiverReasonField(models.TNWaiver, "will_use_waiver"))
}
