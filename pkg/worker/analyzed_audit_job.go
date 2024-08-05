package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
)

/*
######################
# AnalyzedAudit Jobs #
######################
*/

// AnalyzedAuditJob analyzes the given model and model relations on the specified date
// args[0] date, args[1] modelPlanID
func (w *Worker) AnalyzedAuditJob(ctx context.Context, args ...interface{}) error {
	dayToAnalyze, err := time.Parse("2006-01-02", args[0].(string))
	if err != nil {
		return err
	}
	modelPlanID, err := uuid.Parse(args[1].(string))
	if err != nil {
		return err
	}
	// Note, this will panic if the context doesn't have a faktory job context it will panic.
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsAndBatchID(w.Logger, helper, modelPlanIDZapField(modelPlanID), dateZapField(dayToAnalyze))
	_, err = resolvers.AnalyzeModelPlanForAnalyzedAudit(ctx, w.Store, logger, dayToAnalyze, modelPlanID)

	if err != nil {
		logger.Error("issue executing analyzed audit job", zap.Error(err))
		return err
	}
	return nil
}

// AnalyzedAuditBatchJob batches all the daily AnalyzedAuditJobs. When all are complete it will fire a callback
// args[0] date
func (w *Worker) AnalyzedAuditBatchJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFields(w.Logger, helper)
	logger.Info("starting analyzed audit batch job")

	dayToAnalyze := args[0]
	modelPlans, err := w.Store.ModelPlanCollection(w.Logger, false)
	if err != nil {
		return err
	}

	// Create batch of AnalyzedAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Analyze models audits by date"
		batch.Success = faktory.NewJob(analyzedAuditBatchJobSuccessName, dayToAnalyze)
		batch.Success.Queue = criticalQueue

		logger = logger.With(BIDZapField(batch.Bid))
		logger.Info("Creating a new batch for the analyze audit batch job")

		return batch.Jobs(func() error {
			for _, mp := range modelPlans {
				innerLogger := logger.With(dateZapField(dayToAnalyze), modelPlanIDZapField(mp.ID))
				innerLogger.Info("creating analyzed audit job")
				job := faktory.NewJob(analyzedAuditJobName, dayToAnalyze, mp.ID)
				job.Queue = criticalQueue
				innerLogger.Info("pushing analyzed audit job")
				err = batch.Push(job)
				if err != nil {
					innerLogger.Error("issue pushing the analyzed audit job", zap.Error(err))
					return err
				}
			}
			return nil
		})
	})
}

// AnalyzedAuditBatchJobSuccess is the callback function for AnalyzedAuditBatchJob
// args[0] date
func (w *Worker) AnalyzedAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	dateAnalyzed := args[0]
	help := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsAndBatchID(w.Logger, help)

	// Kick off DigestEmailBatchJob
	return help.With(func(cl *faktory.Client) error {
		logger.Info("Analyzed Audit Batch Job was successful.")
		job := faktory.NewJob(digestEmailBatchJobName, dateAnalyzed)
		job.Queue = criticalQueue
		logger.Info("Pushing digest email batch job")
		return cl.Push(job)
	})
}
