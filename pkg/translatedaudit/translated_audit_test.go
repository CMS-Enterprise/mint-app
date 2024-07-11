// Package translatedaudit translates audit delta slices to human readable changes
package translatedaudit

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
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
			DbField: otherParentField,

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
