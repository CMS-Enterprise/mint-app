package translatedaudit

import (
	"fmt"

	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// checkIfDocumentIsRestricted looks at the translated fields for a document to see if it should be restricted or not
func checkIfDocumentIsRestricted(tAuditFields []*models.TranslatedAuditField, operation models.DatabaseOperation) (bool, error) {

	restrictedField, fieldFound := lo.Find(tAuditFields, func(field *models.TranslatedAuditField) bool {
		return field.FieldName == "restricted"
	})
	if !fieldFound {
		return true, fmt.Errorf("couldn't find the field to say if this document is restricted or not")
	}
	var restrictedValue interface{}
	if operation == models.DBOpDelete || operation == models.DBOpTruncate {
		restrictedValue = restrictedField.Old
	} else {
		restrictedValue = restrictedField.New
	}

	restricted := (restrictedValue == true || restrictedValue == "true")
	return restricted, nil

}

// checkIfDocumentLinkIsRestricted looks at document data for a link if present and sets if it should be restricted or not
func checkIfDocumentLinkIsRestricted(metaData *models.TranslatedAuditMetaDocumentSolutionLink) (bool, error) {

	if metaData == nil {
		return false, fmt.Errorf("meta data is nil for document solution link. Unable to check restriction level")
	}

	// default to not restricted (zero state of bool)
	var restricted bool

	if metaData.DocumentRestricted != nil {
		// if the visibility is present, check it's value. if it is true, it is restricted
		restricted = *metaData.DocumentRestricted
	}
	return restricted, nil

}
