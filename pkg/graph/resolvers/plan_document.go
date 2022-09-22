package resolvers

import (
	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
	"github.com/cmsgov/mint-app/pkg/upload"
)

// PlanDocumentCreate implements resolver logic to upload the specified file to S3 and create a matching plan document entity in the database.
func PlanDocumentCreate(logger *zap.Logger, input model.PlanDocumentInput, principal authentication.Principal, store *storage.Store, s3Client *upload.S3Client) (*models.PlanDocument, error) {
	document := models.NewPlanDocument(principal.ID(), input.ModelPlanID)
	document.FileType = input.FileData.ContentType
	document.Bucket = *s3Client.GetBucket()
	document.FileKey = uuid.NewString()
	document.FileName = input.FileData.Filename
	document.FileSize = int(input.FileData.Size)
	document.DocumentType = input.DocumentType
	document.OtherTypeDescription = zero.StringFromPtr(input.OtherTypeDescription)
	document.OptionalNotes = zero.StringFromPtr(input.OptionalNotes)

	err := BaseStructPreCreate(logger, document, principal, store, true)
	if err != nil {
		return nil, err
	}

	err = s3Client.UploadFile(input.FileData.File, document.FileKey)
	if err != nil {
		return &models.PlanDocument{}, err
	}

	document, err = store.PlanDocumentCreate(logger, principal.ID(), document, s3Client)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, document)
	}

	return &models.PlanDocument{}, nil
}

// PlanDocumentRead implements resolver logic to fetch a plan document object by ID
func PlanDocumentRead(logger *zap.Logger, store *storage.Store, s3Client *upload.S3Client, id uuid.UUID) (*models.PlanDocument, error) {
	document, err := store.PlanDocumentRead(logger, s3Client, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentsReadByModelPlanID implements resolver logic to fetch a plan document object by model plan ID
func PlanDocumentsReadByModelPlanID(logger *zap.Logger, id uuid.UUID, store *storage.Store, s3Client *upload.S3Client) ([]*models.PlanDocument, error) {
	documents, err := store.PlanDocumentsReadByModelPlanID(logger, id, s3Client)
	if err != nil {
		return nil, err
	}

	return documents, nil
}

// PlanDocumentDelete implements resolver logic to update a plan document object
func PlanDocumentDelete(logger *zap.Logger, s3Client *upload.S3Client, id uuid.UUID, principal authentication.Principal, store *storage.Store) (int, error) {
	existingdoc, err := store.PlanDocumentRead(logger, s3Client, id)
	if err != nil {
		return 0, err
	}
	err = BaseStructPreDelete(logger, existingdoc, principal, store, true)
	if err != nil {
		return 0, err
	}

	sqlResult, err := store.PlanDocumentDelete(logger, id)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
