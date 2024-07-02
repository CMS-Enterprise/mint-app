package translatedaudit

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func TranslateAuditJobByID(ctx context.Context, store *storage.Store, logger *zap.Logger, auditID int, queueID uuid.UUID) (*models.TranslatedAuditWithTranslatedFields, error) {

	queueEntry, err := storage.TranslatedAuditQueueGetByID(store, queueID)
	if err != nil {
		return nil, fmt.Errorf("unable to return translatedAuditQueue entry  for translated_audit_queue_id (%s) for the translate audit job. Err %w", queueID, err)

	}
	queueEntry.Attempts++
	queueEntry.Status = models.TPSProcessing

	queueEntry, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
	if err != nil {
		return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}

	translatedAuditAndFields, translateErr := TranslateAudit(ctx, store, logger, auditID)
	if translateErr != nil {
		// fail the translation
		queueEntry.Status = models.TPSFailed
		_, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
		if err != nil {
			return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
		}

		return nil, fmt.Errorf("error translating audit for audit id %v. Err %w", auditID, translateErr)
	}
	queueEntry.Status = models.TPSProcessed
	_, err = storage.TranslatedAuditQueueUpdate(store, logger, queueEntry)
	if err != nil {
		return nil, fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}
	return translatedAuditAndFields, nil

}
