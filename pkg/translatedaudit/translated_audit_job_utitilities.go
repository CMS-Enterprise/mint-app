package translatedaudit

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func TranslateAuditJobByID(ctx context.Context, store *storage.Store, logger *zap.Logger, auditID int, queueID uuid.UUID) (*models.TranslatedAuditWithTranslatedFields, error) {

	queueEntry, err := storage.TranslatedAuditQueueGetByID(store, queueID)
	if err != nil {
		logger.Warn(err.Error(), zap.Error(err))
		return nil, err
	}
	queueEntry.Attempts++
	queueEntry.Status = models.TPSProcessing

	queueEntry, err = TranslatedAuditQueueUpdate(store, logger, queueEntry, constants.GetSystemAccountUUID())
	if err != nil {
		logger.Warn(err.Error(), zap.Error(err))
		return nil, err
	}

	translatedAuditAndFields, translateErr := TranslateAudit(ctx, store, logger, auditID)
	if translateErr != nil {
		// Errors as checks the type of the error. In this case, we check if it is a duplicate constraint error from pq. If so, we don't fail the job.
		duplicateTranslatedAuditExist := errors.As(translateErr, &sqlutils.ErrDuplicateConstraint)

		if !duplicateTranslatedAuditExist {
			// fail the translation
			queueEntry.Status = models.TPSFailed
			_, err = TranslatedAuditQueueUpdate(store, logger, queueEntry, constants.GetSystemAccountUUID())
			if err != nil {
				logger.Warn(err.Error(), zap.Error(err))
				return nil, err
			}

			logger.Warn(err.Error(), zap.Error(err))
			return nil, err
		}
		queueEntry.Note = models.StringPointer("A translation already exists for this change.")
	}
	queueEntry.Status = models.TPSProcessed
	_, err = TranslatedAuditQueueUpdate(store, logger, queueEntry, constants.GetSystemAccountUUID())
	if err != nil {
		finalErr := fmt.Errorf("unable to return final translatedAuditQueue entry, err: %w", err)
		logger.Warn(finalErr.Error(), zap.Error(finalErr))
		return nil, finalErr
	}
	return translatedAuditAndFields, nil

}

// TranslatedAuditQueueUpdate handles the business logic of setting who modified a translated audit queue entry, and calling the appropriate store methods.
func TranslatedAuditQueueUpdate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	translatedAuditQueue *models.TranslatedAuditQueue,
	modifiedByAccountID uuid.UUID,
) (*models.TranslatedAuditQueue, error) {

	// Note, we don't call set modified by here for simplicity.
	translatedAuditQueue.ModifiedBy = &modifiedByAccountID

	return storage.TranslatedAuditQueueUpdate(np, logger, translatedAuditQueue)

}
