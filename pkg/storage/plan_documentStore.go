package storage

import (
	"database/sql"
	_ "embed"
	"net/url"

	"github.com/jmoiron/sqlx"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/upload"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_document_create.sql
var planDocumentCreateSQL string

//go:embed SQL/plan_document_update.sql
var planDocumentUpdateSQL string

//go:embed SQL/plan_document_read_by_id.sql
var planDocumentGetByIDSQL string

//go:embed SQL/plan_document_read_by_model_plan_id.sql
var planDocumentGetByModelPlanIDSQL string

//go:embed SQL/plan_document_delete_by_id.sql
var planDocumentDeleteByIDSQL string

// PlanDocumentCreate creates a plan document
func (s *Store) PlanDocumentCreate(
	logger *zap.Logger,
	principal string,
	inputDocument *models.PlanDocument,
	documentURL *string,
	s3Client *upload.S3Client) (*models.PlanDocument, error) {

	parsedURL, urlErr := url.Parse(*documentURL)
	if urlErr != nil {
		return nil, urlErr
	}

	key, keyErr := s3Client.KeyFromURL(parsedURL)
	if keyErr != nil {
		return nil, keyErr
	}

	document := models.PlanDocument{
		ID:                   utilityUUID.ValueOrNewUUID(inputDocument.ID),
		ModelPlanID:          inputDocument.ModelPlanID,
		FileType:             inputDocument.FileType,
		Bucket:               s3Client.GetBucket(),
		FileKey:              &key,
		VirusScanned:         false,
		VirusClean:           false,
		FileName:             inputDocument.FileName,
		FileSize:             inputDocument.FileSize,
		DocumentType:         inputDocument.DocumentType,
		OtherTypeDescription: inputDocument.OtherTypeDescription,
		OptionalNotes:        inputDocument.OptionalNotes,
		DeletedAt:            nil,
		CreatedBy:            principal,
	}

	statement, err := s.db.PrepareNamed(planDocumentCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	document.ModifiedBy = nil
	document.ModifiedDts = nil

	err = statement.Get(&document, &document)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	return &document, nil
}

// PlanDocumentRead reads a plan document object by id
func (s *Store) PlanDocumentRead(logger *zap.Logger, s3Client *upload.S3Client, id uuid.UUID) (*models.PlanDocument, error) {
	statement, err := s.db.PrepareNamed(planDocumentGetByIDSQL)
	if err != nil {
		return nil, err
	}

	var document models.PlanDocument
	err = statement.Get(&document, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, id)
	}

	err = planDocumentUpdateVirusScanStatus(s3Client, &document)
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, id)
	}

	return &document, nil
}

// PlanDocumentsReadByModelPlanID reads a plan document object by model plan id
func (s *Store) PlanDocumentsReadByModelPlanID(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	s3Client *upload.S3Client) ([]*models.PlanDocument, error) {

	statement, err := s.db.PrepareNamed(planDocumentGetByModelPlanIDSQL)
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, modelPlanID)
	}

	queryResults, err := statement.Queryx(utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	documents, err := planDocumentsUnpackQueryResults(logger, modelPlanID, queryResults)
	if err != nil {
		return nil, err
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	err = logIfNoRowsFetched(logger, modelPlanID, documents)
	return documents, err
}

func planDocumentsUpdateVirusScanStatuses(s3Client *upload.S3Client, documents []*models.PlanDocument) error {
	var errorGroup errgroup.Group
	for documentIndex := range documents {
		document := documents[documentIndex]
		errorGroup.Go(func() error {
			return planDocumentUpdateVirusScanStatus(s3Client, document)
		})
	}

	return errorGroup.Wait()
}

func planDocumentUpdateVirusScanStatus(s3Client *upload.S3Client, document *models.PlanDocument) error {
	status, err := fetchDocumentTag(s3Client, document, "av-status")
	if err != nil {
		return err
	}

	if status == "CLEAN" {
		document.VirusScanned = true
		document.VirusClean = true
	} else if status == "INFECTED" {
		document.VirusScanned = true
		document.VirusClean = false
	} else {
		document.VirusScanned = false
		document.VirusClean = false
	}
	return nil
}

func fetchDocumentTag(s3Client *upload.S3Client, document *models.PlanDocument, tagName string) (string, error) {
	value, valueErr := s3Client.TagValueForKey(*document.FileKey, tagName)
	if valueErr != nil {
		return "", valueErr
	}
	return value, nil
}

func planDocumentsUnpackQueryResults(logger *zap.Logger, modelPlanID uuid.UUID, queryResults *sqlx.Rows) ([]*models.PlanDocument, error) {
	var documents []*models.PlanDocument
	for queryResults.Next() {
		var document models.PlanDocument
		err := queryResults.StructScan(&document)
		if err != nil {
			return nil, genericmodel.HandleModelFetchGenericError(logger, queryResults.Err(), modelPlanID)
		}

		documents = append(documents, &document)
	}

	if queryResults.Err() != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, queryResults.Err(), modelPlanID)
	}

	return documents, nil
}

func logIfNoRowsFetched(logger *zap.Logger, modelPlanID uuid.UUID, documents []*models.PlanDocument) error {
	if len(documents) == 0 {
		return genericmodel.HandleModelFetchByIDNoRowsError(logger, nil, modelPlanID)
	}

	return nil
}

// PlanDocumentUpdate updates a plan document object by id with provided values
func (s *Store) PlanDocumentUpdate(logger *zap.Logger, plan *models.PlanDocument) (*models.PlanDocument, error) {
	statement, err := s.db.PrepareNamed(planDocumentUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, plan)
	}

	return plan, nil
}

// PlanDocumentDelete deletes a plan document object by id
func (s *Store) PlanDocumentDelete(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	statement, err := s.db.PrepareNamed(planDocumentDeleteByIDSQL)
	if err != nil {
		return nil, err
	}

	sqlResult, err := statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil
}
