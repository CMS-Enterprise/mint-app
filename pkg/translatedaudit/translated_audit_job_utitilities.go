package translatedaudit

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func TranslateAuditJobByID(ctx context.Context, store *storage.Store, logger *zap.Logger, auditID int, queueID uuid.UUID) (*models.TranslatedAuditWithTranslatedFields, error) {

	queueEntry, err := storage.TranslatedAuditQueueGetByID(store, queueID)
	if err != nil {
		decErr := fmt.Errorf("unable to return translatedAuditQueue entry  for translated_audit_queue_id (%s) for the translate audit job. Err %w", queueID, err)
		logger.Warn(decErr.Error())
		return nil, decErr
	}
	queueEntry.Attempts++
	queueEntry.Status = models.TPSProcessing

	queueEntry, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
	if err != nil {
		return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}

	translatedAuditAndFields, translateErr := TranslateAudit(ctx, store, logger, auditID)
	if translateErr != nil {
		// Errors as checks the type of the error. In this case, we check if it is a duplicate constraint error from pq. If so, we don't fail the job.
		duplicateTranslatedAuditExist := errors.As(translateErr, &sqlutils.ErrDuplicateConstraint)

		if !duplicateTranslatedAuditExist {
			// fail the translation
			queueEntry.Status = models.TPSFailed
			_, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
			if err != nil {
				return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
			}

			return nil, fmt.Errorf("error translating audit for audit id %v. Err %w", auditID, translateErr)
		}
		queueEntry.Note = models.StringPointer("A translation already exists for this change.")
	}
	queueEntry.Status = models.TPSProcessed
	_, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
	if err != nil {
		return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}
	return translatedAuditAndFields, nil

}
