package worker

import (
	"context"
	"fmt"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

var prepareForClearanceJobMaxRetry = 2

const (
	prepareForClearanceBatchJobName        string = "PrepareForClearanceBatchJob"
	prepareForClearanceBatchJobSuccessName string = "PrepareForClearanceBatchJobSuccess"
)

// PrepareForClearanceBatchJob is the job the cron job initiates to find model plans whose
// PREPARE_FOR_CLEARANCE task should activate (see
// storage.PlanTaskGetModelPlanIDsDueForPrepareForClearance), and batches one
// PrepareForClearanceJob per plan.
func (w *Worker) PrepareForClearanceBatchJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("Getting collection of model plans due for PREPARE_FOR_CLEARANCE activation")

	triggerThreshold := time.Now().AddDate(0, 0, models.PrepareForClearanceTriggerDays)
	modelPlanIDs, err := storage.PlanTaskGetModelPlanIDsDueForPrepareForClearance(w.Store, logger.Logger, triggerThreshold)
	if err != nil {
		logger.ErrorOrWarn("unable to get model plans due for PREPARE_FOR_CLEARANCE activation", zap.Error(err))
		return err
	}

	return helper.With(func(cl *faktory.Client) error {
		return CreatePrepareForClearanceBatch(logger, cl, modelPlanIDs)
	})
}

// CreatePrepareForClearanceBatch creates a Faktory batch with one PrepareForClearanceJob per
// model plan ID, firing PrepareForClearanceBatchJobSuccess when the whole batch completes.
func CreatePrepareForClearanceBatch[T logging.ChainableErrorOrWarnLogger[T]](logger T, cl *faktory.Client, modelPlanIDs []*uuid.UUID) error {
	batch := faktory.NewBatch(cl)
	logger = logger.With(logfields.BID(batch.Bid))
	batch.Description = "Activate due PREPARE_FOR_CLEARANCE tasks"
	batch.Success = faktory.NewJob(prepareForClearanceBatchJobSuccessName)
	batch.Success.Queue = criticalQueue

	return batch.Jobs(func() error {
		for _, modelPlanID := range modelPlanIDs {
			err := CreatePrepareForClearanceJobInBatch(logger, batch, *modelPlanID)
			if err != nil {
				err = fmt.Errorf("error creating job for PrepareForClearance activation. modelPlanID %v. Err %w", modelPlanID, err)
				logger.ErrorOrWarn("issue creating PrepareForClearanceJob", zap.Error(err))
				return err
			}
		}
		return nil
	})
}

// CreatePrepareForClearanceJobInBatch queues a single PrepareForClearanceJob within an
// already-open batch.
func CreatePrepareForClearanceJobInBatch[T logging.ChainableErrorOrWarnLogger[T]](logger T, batch *faktory.Batch, modelPlanID uuid.UUID) error {
	logger = logger.With(logfields.ModelPlanID(modelPlanID))
	logger.Info("creating job for PREPARE_FOR_CLEARANCE activation.")
	job := faktory.NewJob(prepareForClearanceJobName, modelPlanID)
	job.Queue = criticalQueue
	job.Retry = &prepareForClearanceJobMaxRetry
	err := batch.Push(job)
	if err != nil {
		logger.ErrorOrWarn("issue pushing job to batch", zap.Error(err))
		return err
	}
	logger.Info("finished queueing PREPARE_FOR_CLEARANCE activation.")
	return nil
}

// PrepareForClearanceBatchJobSuccess is called when the prepare-for-clearance batch job has
// completed.
func (w *Worker) PrepareForClearanceBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("Prepare For Clearance batch job completed successfully")
	return nil
}
