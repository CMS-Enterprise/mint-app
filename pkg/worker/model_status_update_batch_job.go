package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

var modelStatusUpdateJobMaxRetry = 2

// ModelStatusUpdateBatchJob is the job the cron job initiates to check if models need a status update.
// It will batch all child jobs, and when complete it will fire a callback
func (w *Worker) ModelStatusUpdateBatchJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	// decorate the logger, but exclude the bid, the bid will be decorated when we create the batch
	logger := loggerWithFaktoryFieldsWithoutBatchID(w.Logger, helper)
	logger.Info("Getting collection of model plans that require status checking")

	// TODO: Implement the logic to return the models to check? Or do we check every model plan?
	modelsToUpdate, err := w.Store.ModelPlanCollection(logger, false)
	if err != nil {
		logger.Error("unable to get model plan collection for the model status update batch job", zap.Error(err))
		return err
	}
	return helper.With(func(cl *faktory.Client) error {
		return CreateModelStatusUpdateBatch(logger, w, cl, modelsToUpdate)
	})
}

func CreateModelStatusUpdateBatch(logger *zap.Logger, w *Worker, cl *faktory.Client, modelPlans []*models.ModelPlan) error {
	batch := faktory.NewBatch(cl)
	// decorate the logger with the BID
	logger = logger.With(logfields.BID(batch.Bid))
	batch.Description = "Check if model status should be updated"
	batch.Success = faktory.NewJob(modelStatusUpdateBatchJobSuccessName)
	batch.Success.Queue = criticalQueue

	err := batch.Jobs(func() error {
		for _, plan := range modelPlans {
			err := CreateModelStatusJobInBatch(logger, w, batch, plan)
			if err != nil {
				err = fmt.Errorf(" error creating job for ModelStatus Update. modelPlanID %v. Err %w", plan.ID, err)
				logger.Error("issue creating ModelStatusUpdateJob", zap.Error(err))
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
	// decorate the logger with the model plan id
	logger = logger.With(logfields.ModelPlanID(plan.ID))
	logger.Info("creating job for model status update.")
	job := faktory.NewJob(modelStatusUpdateJobName, plan.ID)
	//TODO: (MINT-3036) verify, if this should use the critical queue? Or should we generate another queue for this?
	job.Queue = criticalQueue
	job.Retry = &modelStatusUpdateJobMaxRetry
	err := batch.Push(job)
	if err != nil {
		logger.Error("issue pushing job to batch", zap.Error(err))
		return err
	}
	logger.Info("finished queueing model status update.")
	return nil
}

// ModelStatusUpdateBatchJobSuccess is called when the model status update job has completed.
func (w *Worker) ModelStatusUpdateBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFields(w.Logger, helper)
	logger.Info("Model Status update job completed successfully")
	return nil
}
