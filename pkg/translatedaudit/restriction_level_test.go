package translatedaudit

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestCheckIfDocumentIsRestricted(t *testing.T) {
	assert := assert.New(t)
	t.Run("Will return true, if restricted field is present, and answer is `true` or 'true'", func(t *testing.T) {

		fields := []*models.TranslatedAuditField{
			{
				FieldName: "restricted",
				Old:       "true",
			},
		}
		restricted, err := checkIfDocumentIsRestricted(fields, models.DBOpDelete)

		assert.NoError(err)
		assert.True(restricted)

		fields[0].Old = true
		restricted, err = checkIfDocumentIsRestricted(fields, models.DBOpDelete)

		assert.NoError(err)
		assert.True(restricted)
	})

	t.Run("Will return error, if restricted field is not present", func(t *testing.T) {
		fields := []*models.TranslatedAuditField{
			{
				FieldName: "nonsense_field",
				Old:       "true",
				New:       "blah blah",
			},
		}
		restricted, err := checkIfDocumentIsRestricted(fields, models.DBOpInsert)
		assert.Error(err)
		assert.True(restricted)

		restricted, err = checkIfDocumentIsRestricted(fields, models.DBOpDelete)
		assert.Error(err)
		assert.True(restricted)
	})

	t.Run("Will return field, if restricted field is present, and relevant answer is not `true` or 'true' according to the db operation", func(t *testing.T) {

		fields := []*models.TranslatedAuditField{
			{
				FieldName: "restricted",
				Old:       "true",
			},
		}
		restricted, err := checkIfDocumentIsRestricted(fields, models.DBOpInsert)

		assert.NoError(err)
		assert.False(restricted)

		fields[0].Old = true
		restricted, err = checkIfDocumentIsRestricted(fields, models.DBOpUpdate)

		assert.NoError(err)
		assert.False(restricted)
	})
}

func TestCheckIfDocumentLinkIsRestricted(t *testing.T) {

	assert := assert.New(t)

	falseBool := false
	trueBool := true

	t.Run("Will return true, if link meta data is true", func(t *testing.T) {
		docSolLinkMeta := models.TranslatedAuditMetaDocumentSolutionLink{
			DocumentRestricted: &trueBool,
		}
		restricted, err := checkIfDocumentLinkIsRestricted(&docSolLinkMeta)

		assert.True(restricted)
		assert.NoError(err)

	})
	t.Run("Will return false, if link meta data is false", func(t *testing.T) {
		docSolLinkMeta := models.TranslatedAuditMetaDocumentSolutionLink{
			DocumentRestricted: &falseBool,
		}
		restricted, err := checkIfDocumentLinkIsRestricted(&docSolLinkMeta)

		assert.False(restricted)
		assert.NoError(err)

	})

}
