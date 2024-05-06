package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// TranslatedAuditQueueCreate creates a TranslatedAuditQueue in the database, using the values passed in the translatedAuditQueue parameter
func TranslatedAuditQueueCreate(np sqlutils.NamedPreparer, translatedAuditQueue *models.TranslatedAuditQueue) (*models.TranslatedAuditQueue, error) {
	if translatedAuditQueue.ID == uuid.Nil {
		translatedAuditQueue.ID = uuid.New()
	}

	retHumanizedChange, procError := sqlutils.GetProcedure[models.TranslatedAuditQueue](np, sqlqueries.TranslatedAuditQueue.Create, translatedAuditQueue)
	if procError != nil {
		return nil, fmt.Errorf("issue creating new TranslatedAuditQueue object: %w", procError)
	}
	return retHumanizedChange, nil
}

// TranslatedAuditQueueGetByID returns a translatedAuditQueue for a given id
func TranslatedAuditQueueGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*models.TranslatedAuditQueue, error) {

	arg := map[string]interface{}{"id": id}

	translatedAuditQueue, procErr := sqlutils.GetProcedure[models.TranslatedAuditQueue](np, sqlqueries.TranslatedAuditQueue.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit queue object by id (%s)  : %w", id, procErr)
	}
	return translatedAuditQueue, nil
}

// TranslatedAuditQueueGetEntriesToQueue returns a translatedAuditQueue entries that are ready to be queued
func TranslatedAuditQueueGetEntriesToQueue(np sqlutils.NamedPreparer) ([]*models.TranslatedAuditQueue, error) {

	arg := map[string]interface{}{}
	translatedAuditQueue, procErr := sqlutils.SelectProcedure[models.TranslatedAuditQueue](np, sqlqueries.TranslatedAuditQueue.GetEntriesToQueue, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit queue objects that are ready to queue  : %w", procErr)
	}
	return translatedAuditQueue, nil
}

// TranslatedAuditQueueGetQueued returns a translatedAuditQueue entries that are already queued
func TranslatedAuditQueueGetQueued(np sqlutils.NamedPreparer) ([]*models.TranslatedAuditQueue, error) {

	arg := map[string]interface{}{}
	translatedAuditQueue, procErr := sqlutils.SelectProcedure[models.TranslatedAuditQueue](np, sqlqueries.TranslatedAuditQueue.GetQueuedEntries, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit queue objects that are already  queued  : %w", procErr)
	}
	return translatedAuditQueue, nil
}

// TranslatedAuditQueueUpdate updates a TranslatedAuditQueue record in the database
func TranslatedAuditQueueUpdate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	translatedAuditQueue *models.TranslatedAuditQueue) (*models.TranslatedAuditQueue, error) {

	retTranslatedAuditQueue, procErr := sqlutils.GetProcedure[models.TranslatedAuditQueue](np, sqlqueries.TranslatedAuditQueue.Update, translatedAuditQueue)

	if procErr != nil {
		return nil, fmt.Errorf("issue updating translated audit queue object (%v)  err: %w", translatedAuditQueue, procErr)
	}
	return retTranslatedAuditQueue, nil
}
