package storage

import (
	"database/sql"
	_ "embed"

	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/upload"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_document/create.sql
var planDocumentCreateSQL string

//go:embed SQL/plan_document/update.sql
var planDocumentUpdateSQL string

//go:embed SQL/plan_document/read_by_id.sql
var planDocumentGetByIDSQL string

//go:embed SQL/plan_document/read_by_model_plan_id.sql
var planDocumentGetByModelPlanIDSQL string

//go:embed SQL/plan_document/read_by_solution_id.sql
var planDocumentsGetBySolutionIDSQL string

//go:embed SQL/plan_document/read_by_model_plan_id_not_restricted.sql
var planDocumentGetByModelPlanIDNotRestrictedSQL string

//go:embed SQL/plan_document/read_by_solution_id_not_restricted.sql
var planDocumentGetBySolutionIDNotRestrictedSQL string

//go:embed SQL/plan_document/delete_by_id.sql
var planDocumentDeleteByIDSQL string

//go:embed SQL/plan_document_solution_link/delete_by_document_id.sql
var planDocumentSolutionLinksDeleteByDocumentIDSQL string

// PlanDocumentCreate creates a plan document
func (s *Store) PlanDocumentCreate(
	logger *zap.Logger,
	principal string,
	inputDocument *models.PlanDocument,
	s3Client *upload.S3Client) (*models.PlanDocument, error) {

	inputDocument.ID = utilityUUID.ValueOrNewUUID(inputDocument.ID)
	inputDocument.ModifiedBy = nil
	inputDocument.ModifiedDts = nil

	retDoc := &models.PlanDocument{}
	statement, err := s.db.PrepareNamed(planDocumentCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, inputDocument)
	}

	err = statement.Get(retDoc, inputDocument)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, retDoc)
	}

	return retDoc, nil
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
		return nil, err
	}

	err = planDocumentUpdateVirusScanStatus(s3Client, &document)
	if err != nil {
		return nil, err
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
		return nil, err
	}

	var documents []*models.PlanDocument
	err = statement.Select(&documents, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	err = logIfNoRowsFetched(logger, modelPlanID, documents)
	return documents, err
}

// PlanDocumentsReadBySolutionID reads a plan document object by solution id
func (s *Store) PlanDocumentsReadBySolutionID(
	logger *zap.Logger,
	solutionID uuid.UUID,
	s3Client *upload.S3Client) ([]*models.PlanDocument, error) {

	statement, err := s.db.PrepareNamed(planDocumentsGetBySolutionIDSQL)
	if err != nil {
		return nil, err
	}

	var documents []*models.PlanDocument
	err = statement.Select(&documents, utilitySQL.CreateSolutionIDQueryMap(solutionID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	err = logIfNoRowsFetched(logger, solutionID, documents)
	return documents, err
}

// PlanDocumentsReadByModelPlanIDNotRestricted reads a plan document object by model plan id and restricted = false
func (s *Store) PlanDocumentsReadByModelPlanIDNotRestricted(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	s3Client *upload.S3Client) ([]*models.PlanDocument, error) {

	statement, err := s.db.PrepareNamed(planDocumentGetByModelPlanIDNotRestrictedSQL)
	if err != nil {
		return nil, err
	}

	var documents []*models.PlanDocument
	err = statement.Select(&documents, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	err = logIfNoRowsFetched(logger, modelPlanID, documents)
	return documents, err
}

// PlanDocumentsReadBySolutionIDNotRestricted reads a plan document object by model plan id and restricted = false
func (s *Store) PlanDocumentsReadBySolutionIDNotRestricted(
	logger *zap.Logger,
	solutionID uuid.UUID,
	s3Client *upload.S3Client) ([]*models.PlanDocument, error) {

	statement, err := s.db.PrepareNamed(planDocumentGetBySolutionIDNotRestrictedSQL)
	if err != nil {
		return nil, err
	}

	var documents []*models.PlanDocument
	err = statement.Select(&documents, utilitySQL.CreateSolutionIDQueryMap(solutionID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	err = logIfNoRowsFetched(logger, solutionID, documents)
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
	value, valueErr := s3Client.TagValueForKey(document.FileKey, tagName)
	if valueErr != nil {
		return "", valueErr
	}
	return value, nil
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
func (s *Store) PlanDocumentDelete(logger *zap.Logger, id uuid.UUID, userID uuid.UUID) (sql.Result, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()
	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	statement, err := tx.PrepareNamed(planDocumentSolutionLinksDeleteByDocumentIDSQL)
	if err != nil {
		return nil, err
	}

	_, err = statement.Exec(utilitySQL.CreateDocumentIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	statement, err = tx.PrepareNamed(planDocumentDeleteByIDSQL)
	if err != nil {
		return nil, err
	}

	sqlResult, err := statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return sqlResult, nil
}
