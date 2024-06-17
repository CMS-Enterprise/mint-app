package translatedaudit

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *TAuditSuite) TestCheckIfDocumentIsRestricted() {
	// tAudit := models.TranslatedAudit
}

func (suite *TAuditSuite) TestCheckIfDocumentLinkIsRestricted() {

	falseBool := false
	trueBool := true

	suite.Run("Will return true, if link meta data is true", func() {
		docSolLinkMeta := models.TranslatedAuditMetaDocumentSolutionLink{
			DocumentRestricted: &trueBool,
		}
		restricted, err := checkIfDocumentLinkIsRestricted(&docSolLinkMeta)

		suite.True(restricted)
		suite.NoError(err)

	})
	suite.Run("Will return false, if link meta data is false", func() {
		docSolLinkMeta := models.TranslatedAuditMetaDocumentSolutionLink{
			DocumentRestricted: &falseBool,
		}
		restricted, err := checkIfDocumentLinkIsRestricted(&docSolLinkMeta)

		suite.False(restricted)
		suite.NoError(err)

	})

}
