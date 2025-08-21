package worker

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/logfields"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ModelStatusUpdateJob is the job to check if a model should be updated, and if so, it will send an email
// args[0] model_plan_id (UUID)
func (w *Worker) ModelStatusUpdateJob(ctx context.Context, args ...interface{}) (returnedError error) {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsWithoutBatchID(w.Logger, helper)
	logger.Info("model status update job reached.")

	if len(args) < 1 {
		err := fmt.Errorf("no arguments were provided for this job")
		logger.Error(err.Error(), zap.Error(err))
	}
	arg1String := fmt.Sprint(args[0])
	modelPlanID, err := uuid.Parse(arg1String)
	if err != nil {
		err = fmt.Errorf("unable to convert argument  ( %v )to an uuid as expected for translated_audit_queue_id for the translate audit job. Err %w", args[1], err)
		logger.Error(err.Error(), zap.Error(err))
	}
	logger = logger.With(logfields.ModelPlanID(modelPlanID))

	logger.Info("checking if model status should be updated, and creating notification")

	return resolvers.TryNotificationSendIncorrectModelStatus(
		ctx,
		w.Store,
		logger,
		w.EmailService,
		&w.EmailTemplateService,
		w.AddressBook,
		modelPlanID,
	)
}
