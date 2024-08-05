package storage

import (
	"database/sql"
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/upload"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

// PlanDocumentCreate creates a plan document
func (s *Store) PlanDocumentCreate(
	logger *zap.Logger,
	principal string,
	inputDocument *models.PlanDocument) (*models.PlanDocument, error) {

	inputDocument.ID = utilityUUID.ValueOrNewUUID(inputDocument.ID)
	inputDocument.ModifiedBy = nil
	inputDocument.ModifiedDts = nil

	retDoc := &models.PlanDocument{}
	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, inputDocument)
	}
	defer stmt.Close()

	err = stmt.Get(retDoc, inputDocument)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, retDoc)
	}

	return retDoc, nil
}

// PlanDocumentGetByIDNoS3Check gets a plan document object by id
func PlanDocumentGetByIDNoS3Check(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	id uuid.UUID,
) (*models.PlanDocument, error) {

	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var document models.PlanDocument
	err = stmt.Get(&document, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &document, nil
}

// PlanDocumentRead reads a plan document object by id
func (s *Store) PlanDocumentRead(
	_ *zap.Logger,
	s3Client *upload.S3Client,
	id uuid.UUID,
) (*models.PlanDocument, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var document models.PlanDocument
	err = stmt.Get(&document, utilitySQL.CreateIDQueryMap(id))
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.GetByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.GetBySolutionID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitySQL.CreateSolutionIDQueryMap(solutionID))
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.GetByModelPlanIDNotRestricted)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.GetBySolutionIDNotRestricted)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitySQL.CreateSolutionIDQueryMap(solutionID))
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

	// if this is a link to another website, we are not currently able to scan the link.
	// in this case, we'll just assume it's clean, otherwise the user won't be able to do anything with the link, making it useless.
	if document.IsLink {
		document.VirusScanned = true
		document.VirusClean = true
		return nil
	}
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocument.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}
	defer stmt.Close()

	err = stmt.Get(plan, plan)
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

	stmt, err := tx.PrepareNamed(sqlqueries.PlanDocumentSolutionLink.DeleteByDocumentID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(utilitySQL.CreateDocumentIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	stmt, err = tx.PrepareNamed(sqlqueries.PlanDocument.DeleteByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	sqlResult, err := stmt.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return sqlResult, nil
}
