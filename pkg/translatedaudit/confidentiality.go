package translatedaudit

import (
	"context"
	"fmt"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// setConfidentiality updates a Translated Audit to set if it's confidential or not based on provided criteria
func setConfidentiality(ctx context.Context, store *storage.Store, tAuditWithFields *models.TranslatedAuditWithTranslatedFields, operation models.DatabaseOperation) (*models.TranslatedAuditWithTranslatedFields, error) {
	if tAuditWithFields == nil {
		return nil, fmt.Errorf("translated audit is nil. It must be present to set it's confidentiality level")
	}
	var err error
	// default to false with zero state bool
	var isConfidential bool
	switch tAuditWithFields.TableName {
	case "plan_document":

		//Changes: (Confidential) See about refactoring this. Could this all be part of the meta data function instead?
		// Note that we don't fetch the document there. This only works because you can't update a document, so we should always expect all rows.
		isConfidential, err = checkIfDocumentIsConfidential(tAuditWithFields, operation)

	case "plan_document_solution_link":
		isConfidential, err = checkIfDocumentLinkIsConfidential(tAuditWithFields, operation)

	default:

	}
	if err != nil {
		return nil, fmt.Errorf("issue setting confidentiality, err %w", err)
	}
	tAuditWithFields.IsConfidential = isConfidential
	return tAuditWithFields, nil

}

// checkIfDocumentIsConfidential looks at the translated fields for a document to see if it confidential
func checkIfDocumentIsConfidential(tAuditWithFields *models.TranslatedAuditWithTranslatedFields, operation models.DatabaseOperation) (bool, error) {
	//Changes: (Confidential) See about refactoring this. Could this all be part of the meta data function instead?

	restrictedField, fieldFound := lo.Find(tAuditWithFields.TranslatedFields, func(field *models.TranslatedAuditField) bool {
		return field.FieldName == "restricted"
	})
	if !fieldFound {
		//Changes: (Confidential)
		return false, fmt.Errorf("couldn't find the field to say if this document is restricted or not")
	}
	var restrictedValue interface{}
	if operation == models.DBOpDelete || operation == models.DBOpTruncate {
		restrictedValue = restrictedField.Old
	} else {
		restrictedValue = restrictedField.New
	}

	//Todo, this doesn't work good. We should just get the current data, maybe we can expand the document meta data too to do that lift?
	restricted := (restrictedValue == true || restrictedValue == "true")
	return restricted, nil

}
func checkIfDocumentLinkIsConfidential(tAuditWithFields *models.TranslatedAuditWithTranslatedFields, operation models.DatabaseOperation) (bool, error) {
	//Changes: (Confidential) See about refactoring this. Could this all be part of the meta data function instead?

	meta, metaDataCast := tAuditWithFields.MetaData.(*models.TranslatedAuditMetaDocumentSolutionLink)
	if !metaDataCast {
		return false, fmt.Errorf("unable to cast metadata to TranslatedAuditMetaDocumentSolutionLink type to check confidentiality")
	}

	// default to not restricted (zero state of bool)
	var restricted bool

	if meta.DocumentVisibility != nil {
		// if the visibility is present, check it's value. if it is true, it is restricted
		restricted = *meta.DocumentVisibility == "true"
	}
	return restricted, nil

}
