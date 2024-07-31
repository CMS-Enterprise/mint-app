package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

var modelStatusUpdateJobMaxRetry = 2

// ModelStatusUpdateBatchJob is the job the cron job initiates to check if models need a status update.
// It will batch all child jobs, and when complete it will fire a callback
func (w *Worker) ModelStatusUpdateBatchJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	sugaredLogger := w.Logger.With(zap.Any("JID", helper.Jid()), zap.Any("BID", helper.Bid()), zap.Any(appSectionKey, faktoryLoggingSection))
	sugaredLogger.Info("Getting collection of model plans that require status checking")

	// TODO: Implement the logic to return the models to check? Or do we check every model plan?
	modelsToUpdate, err := w.Store.ModelPlanCollection(sugaredLogger, false)
	if err != nil {
		sugaredLogger.Error("unable to get model plan collection for the model status update batch job", zap.Error(err))
		return err
	}
	return helper.With(func(cl *faktory.Client) error {
		return CreateModelStatusUpdateBatch(sugaredLogger, w, cl, modelsToUpdate)
	})
}

func CreateModelStatusUpdateBatch(logger *zap.Logger, w *Worker, cl *faktory.Client, modelPlans []*models.ModelPlan) error {
	batch := faktory.NewBatch(cl)
	batch.Description = "Check if model status should be updated"
	batch.Success = faktory.NewJob(modelStatusUpdateBatchJobSuccessName)
	batch.Success.Queue = criticalQueue
	// TODO: verify this overides the parent BID
	sugaredLogger := logger.With(zap.Any("BID", batch.Bid))

	err := batch.Jobs(func() error {
		for _, plan := range modelPlans {
			err := CreateModelStatusJobInBatch(sugaredLogger, w, batch, plan)
			if err != nil {
				err = fmt.Errorf(" error creating job for ModelStatus Update. modelPlanID %v. Err %w", plan.ID, err)
				sugaredLogger.Error("issue creating ModelStatusUpdateJob", zap.Error(err))
				return err
			}
		}
		return nil

	})
	if err != nil {
		return err
	}
	return nil

}

func CreateModelStatusJobInBatch(logger *zap.Logger, w *Worker, batch *faktory.Batch, plan *models.ModelPlan) error {
	sugaredLogger := logger.With(zap.Any("modelPlanID", plan.ID))
	sugaredLogger.Info("creating job for model status update.")
	job := faktory.NewJob(modelStatusUpdateJobName, plan.ID)
	//TODO: verify, do we want to just use the critical queue? Or should we generate another queue for this? Or perhaps choose a different existing queue?
	job.Queue = criticalQueue
	job.Retry = &modelStatusUpdateJobMaxRetry
	err := batch.Push(job)
	if err != nil {
		sugaredLogger.Error("issue pushing job to batch", zap.Error(err))
		return err
	}
	sugaredLogger.Info("finished queueing model status update.")
	return nil
}
