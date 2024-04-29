package worker

import (
	"context"
	"fmt"
	"strconv"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

// TranslateAuditJob is the job to translate an individual audit into an analyzed audit, and note that the translation is done in the processing table
// args[0] the id of the audit (int)
// Changes: (Job) fill out the param specs. Should this be the id of the processing queue instead?
func (w *Worker) TranslateAuditJob(ctx context.Context, args ...interface{}) error {

	if len(args) < 1 {
		return fmt.Errorf("no arguments were provided for this translateAuditJob")
	}

	auditID, err := strconv.Atoi(args[0].(string))
	if err != nil {
		return fmt.Errorf("unable to convert argument  ( %v )to an int as expected for auditID for the translate audit job. Err %w", args[0], err)
	}
	queueID, err := uuid.Parse(args[1].(string))
	if err != nil {
		return fmt.Errorf("unable to convert argument  ( %v )to an uuid as expected for translated_audit_queue_id for the translate audit job. Err %w", args[1], err)
	}

	//Changes: (Job) Extract this logic into the translated audit package, this should only handle parsing args and calling methods

	//TODO Get the queue, set to processing, set attempts to one.
	queueEntry, err := storage.TranslatedAuditQueueGetByID(w.Store, queueID)
	if err != nil {
		return fmt.Errorf("unable to return translatedAuditQueue entry  for translated_audit_queue_id (%s) for the translate audit job. Err %w", queueID, err)

	}
	queueEntry.Attempts++
	queueEntry.Status = models.TPSProcessing

	queueEntry, err = storage.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueEntry)
	if err != nil {
		return fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}
	// NOTE,  this will apply to audits not associated with a model plan, we need to handle those here as well.

	// Changes (Job) Note, we should perhaps wrap updating the audit, and the final updating of the queue item in a transation
	// ALSO! Only grab queue items that are either queued, or set to retry? Should we set up a max retry?
	_, translateErr := translatedaudit.TranslateAudit(ctx, w.Store, w.Logger, auditID)
	if translateErr != nil {
		// fail the translation, update the attempts
		queueEntry.Status = models.TPSFailed
		_, err = storage.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueEntry)
		if err != nil {
			return fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
		}

		return fmt.Errorf("error translating audit for audit id %v. Err %w", auditID, translateErr)
	}
	queueEntry.Status = models.TPSProcessed
	_, err = storage.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueEntry)
	if err != nil {
		return fmt.Errorf("unable to return translatedAuditQueue entry, err: %w", err)
	}
	return nil
}
