package storage

import (
	"context"
	"database/sql"
	_ "embed"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanDocumentCreate creates a plan document
func PlanDocumentCreate(
	tx *sqlx.Tx,
	logger *zap.Logger,
	principal string,
	inputDocument *models.PlanDocument,
) (*models.PlanDocument, error) {

	inputDocument.ID = utilityuuid.ValueOrNewUUID(inputDocument.ID)
	inputDocument.ModifiedBy = nil
	inputDocument.ModifiedDts = nil

	retDoc := &models.PlanDocument{}
	stmt, err := tx.PrepareNamed(sqlqueries.PlanDocument.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, inputDocument)
	}
	defer stmt.Close()

	err = stmt.Get(retDoc, inputDocument)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, retDoc)
	}

	if inputDocument.PlanTaskID != nil {
		link := models.NewPlanTaskDocumentLink(inputDocument.CreatedBy, *inputDocument.PlanTaskID, retDoc.ID)
		_, err = planTaskDocumentLinkCreate(tx, logger, link)
		if err != nil {
			return nil, genericmodel.HandleModelCreationError(logger, err, retDoc)
		}
		retDoc.PlanTaskID = inputDocument.PlanTaskID
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
	err = stmt.Get(&document, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &document, nil
}

// PlanDocumentRead reads a plan document object by id
func PlanDocumentRead(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	s3Client *s3.S3Client,
	id uuid.UUID,
) (*models.PlanDocument, error) {

	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var document models.PlanDocument
	err = stmt.Get(&document, utilitysql.CreateIDQueryMap(id))
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
func PlanDocumentsReadByModelPlanID(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	s3Client *s3.S3Client) ([]*models.PlanDocument, error) {

	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitysql.CreateModelPlanIDQueryMap(modelPlanID))
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

// PlanDocumentsReadByModelPlanIDNotRestricted reads a plan document object by model plan id and restricted = false
func PlanDocumentsReadByModelPlanIDNotRestricted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	s3Client *s3.S3Client) ([]*models.PlanDocument, error) {

	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByModelPlanIDNotRestricted)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitysql.CreateModelPlanIDQueryMap(modelPlanID))
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

// PlanDocumentsReadByPlanTaskID reads plan documents attributed to a plan task.
func PlanDocumentsReadByPlanTaskID(np sqlutils.NamedPreparer, logger *zap.Logger, planTaskID uuid.UUID, s3Client *s3.S3Client) ([]*models.PlanDocument, error) {
	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByPlanTaskID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitysql.CreateIDQueryMap(planTaskID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, planTaskID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, planTaskID)
	}

	err = logIfNoRowsFetched(logger, planTaskID, documents)
	return documents, err
}

// PlanDocumentsReadByPlanTaskIDNotRestricted reads non-restricted plan documents attributed to a plan task.
func PlanDocumentsReadByPlanTaskIDNotRestricted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	planTaskID uuid.UUID,
	s3Client *s3.S3Client) ([]*models.PlanDocument, error) {

	stmt, err := np.PrepareNamed(sqlqueries.PlanDocument.GetByPlanTaskIDNotRestricted)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var documents []*models.PlanDocument
	err = stmt.Select(&documents, utilitysql.CreateIDQueryMap(planTaskID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, planTaskID)
	}

	err = planDocumentsUpdateVirusScanStatuses(s3Client, documents)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, planTaskID)
	}

	err = logIfNoRowsFetched(logger, planTaskID, documents)
	return documents, err
}

func planDocumentsUpdateVirusScanStatuses(s3Client *s3.S3Client, documents []*models.PlanDocument) error {
	var errorGroup errgroup.Group
	for documentIndex := range documents {
		document := documents[documentIndex]
		errorGroup.Go(func() error {
			return planDocumentUpdateVirusScanStatus(s3Client, document)
		})
	}

	return errorGroup.Wait()
}

func planDocumentUpdateVirusScanStatus(s3Client *s3.S3Client, document *models.PlanDocument) error {

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

	switch status {
	case "CLEAN":
		document.VirusScanned = true
		document.VirusClean = true
	case "INFECTED":
		document.VirusScanned = true
		document.VirusClean = false
	default:
		document.VirusScanned = false
		document.VirusClean = false
	}
	return nil
}

func fetchDocumentTag(s3Client *s3.S3Client, document *models.PlanDocument, tagName string) (string, error) {
	value, valueErr := s3Client.TagValueForKey(context.TODO(), document.FileKey, tagName)
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

// PlanDocumentDelete deletes a plan document object by id
func PlanDocumentDelete(tx *sqlx.Tx, logger *zap.Logger, id uuid.UUID, userID uuid.UUID) (sql.Result, error) {

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(sqlqueries.PlanDocument.DeleteByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	sqlResult, err := stmt.Exec(utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil
}
