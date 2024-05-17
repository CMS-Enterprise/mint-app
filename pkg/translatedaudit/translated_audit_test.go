// Package translatedaudit translates audit delta slices to human readable changes
package translatedaudit

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func TestHumanizeAuditsForModelPlan(t *testing.T) {
	//Changes: (ChChCh Changes!) This should really happen in this package, testing in the resolver package for now just for simplicity for a POC

}

func TestTranslateField(t *testing.T) {
	// Tests if a translation doesn't exist, what is returned
	// Test if a translation does exist, what is returned?

	// SEE TestTranslationFieldLabel
	// Changes: (Testing) Verify testing is in the right packages, and that we translate everything sufficiently

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
	testUserAccountUsername := "username"
	testAccount := authentication.UserAccount{
		Username: &testUserAccountUsername,
	}
	plan := models.ModelPlan{}

	t.Run("Form Type is present when there is a translation", func(t *testing.T) {
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(store, translationFieldKey, testAuditField, &testAuditChange, &testAccount, models.DBOpUpdate, &plan, testTranslationMap)
		assert.True(t, wasTranslated)
		assert.NoError(t, err)
		assert.NotNil(t, translatedField.FormType)
		assert.NotNil(t, translatedField.FormType)

		if translatedField.FormType != nil {
			assert.EqualValues(t, testTranslation.FormType, *translatedField.FormType)
		}
		if translatedField.DataType != nil {
			assert.EqualValues(t, testTranslation.DataType, *translatedField.DataType)
		}

	})

	// Changes: (Testing) If we continue to translate fields without translations, re-enable this test. For now, this is returning nil for a field
	// t.Run("Form Type is not present when there is not a translation", func(t *testing.T) {
	// 	var store *storage.Store //nil store
	// 	translatedField, wasTranslated, err := translateField(store, "there is no translation for this", testAuditField, &testAuditChange, &testAccount, models.DBOpUpdate, &plan, testTranslationMap)
	// 	assert.False(t, wasTranslated)
	// 	assert.NoError(t, err)
	// 	assert.Nil(t, translatedField.FormType)
	// })
	t.Run("When there is not a translation, there is no translation field ", func(t *testing.T) {
		var store *storage.Store //nil store
		translatedField, wasTranslated, err := translateField(store, "there is no translation for this", testAuditField, &testAuditChange, &testAccount, models.DBOpUpdate, &plan, testTranslationMap)
		assert.False(t, wasTranslated)
		assert.Nil(t, (translatedField))
		assert.NoError(t, err)

	})

}
