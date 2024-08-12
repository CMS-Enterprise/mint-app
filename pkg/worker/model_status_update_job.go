package worker

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ModelStatusUpdateJob is the job to check if a model should be updated, and if so, it will send an email
// args[0] model_plan_id (UUID)
func (w *Worker) ModelStatusUpdateJob(ctx context.Context, args ...interface{}) (returnedError error) {
	helper := faktory_worker.HelperFor(ctx)
	sugaredLogger := w.Logger.With(zap.Any("JID", helper.Jid()), zap.Any("BID", helper.Bid()), zap.Any(appSectionKey, faktoryLoggingSection))
	sugaredLogger.Info("model status update job reached.")

	if len(args) < 1 {
		err := fmt.Errorf("no arguments were provided for this job")
		sugaredLogger.Error(err.Error(), zap.Error(err))
	}
	arg1String := fmt.Sprint(args[0])
	modelPlanID, err := uuid.Parse(arg1String)
	if err != nil {
		err = fmt.Errorf("unable to convert argument  ( %v )to an uuid as expected for translated_audit_queue_id for the translate audit job. Err %w", args[1], err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
	}
	sugaredLogger = sugaredLogger.With(zap.Any("modelPlanID", modelPlanID))

	sugaredLogger.Info("checking if model status should be updated, and creating notification")

	return resolvers.SendEmailForPhaseSuggestionByModelPlanID(
		ctx,
		w.Store,
		sugaredLogger,
		w.EmailService,
		&w.EmailTemplateService,
		w.AddressBook,
		modelPlanID,
	)
}
