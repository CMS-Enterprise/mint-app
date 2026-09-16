package worker

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
)

const (
	prepareForClearanceJobName string = "PrepareForClearanceJob"
)

// PrepareForClearanceJob activates a single model plan's PREPARE_FOR_CLEARANCE task if it's due
// (see resolvers.PrepareForClearanceActivateIfDue).
// args[0] model_plan_id (UUID)
func (w *Worker) PrepareForClearanceJob(ctx context.Context, args ...interface{}) (returnedError error) {
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("prepare for clearance job reached.")

	if len(args) < 1 {
		err := fmt.Errorf("no arguments were provided for the prepare for clearance job")
		logger.Error(err.Error(), zap.Error(err))
		return err
	}
	arg1String := fmt.Sprint(args[0])
	modelPlanID, err := uuid.Parse(arg1String)
	if err != nil {
		err = fmt.Errorf("unable to convert argument (%v) to a uuid for the prepare for clearance job. Err %w", args[0], err)
		logger.Error(err.Error(), zap.Error(err))
		return err
	}
	logger = logger.With(logfields.ModelPlanID(modelPlanID))

	logger.Info("checking if PREPARE_FOR_CLEARANCE should activate")

	return resolvers.PrepareForClearanceActivateIfDue(
		ctx,
		w.Store,
		logger.Logger,
		modelPlanID,
		w.Store,
		w.EmailService,
		w.AddressBook,
	)
}
