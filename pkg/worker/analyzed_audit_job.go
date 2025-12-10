package worker

import (
	"context"
	"fmt"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
)

/*
######################
# AnalyzedAudit Jobs #
######################
*/

const (
	analyzedAuditJobName             string = "AnalyzedAuditJob"
	analyzedAuditBatchJobName        string = "AnalyzedAuditBatchJob"
	analyzedAuditBatchJobSuccessName string = "AnalyzedAuditBatchJobSuccess"
)

// AnalyzedAuditJob analyzes the given model and model relations on the specified date
// args[0] date, args[1] modelPlanID
func (w *Worker) AnalyzedAuditJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 2 {
		logger.Error("insufficient arguments for AnalyzedAuditJob", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 2 arguments, got %d", len(args))
	}

	dateStr, ok := args[0].(string)
	if !ok {
		logger.Error("args[0] is not a string", zap.String("type", fmt.Sprintf("%T", args[0])))
		return fmt.Errorf("args[0] must be a string, got %T", args[0])
	}

	dayToAnalyze, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		logger.Error("failed to parse date", zap.String("dateStr", dateStr), zap.Error(err))
		return err
	}

	modelPlanIDStr, ok := args[1].(string)
	if !ok {
		logger.Error("args[1] is not a string", zap.String("type", fmt.Sprintf("%T", args[1])))
		return fmt.Errorf("args[1] must be a string, got %T", args[1])
	}

	modelPlanID, err := uuid.Parse(modelPlanIDStr)
	if err != nil {
		logger.Error("failed to parse model plan ID", zap.String("modelPlanIDStr", modelPlanIDStr), zap.Error(err))
		return err
	}
	// Note, this will panic if the context doesn't have a faktory job context it will panic.
	// helper := faktory_worker.HelperFor(ctx)
	//TODO, verify this has the BID already!
	logger = logger.With(logfields.ModelPlanID(modelPlanID), logfields.Date(dayToAnalyze))
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
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("starting analyzed audit batch job")

	if len(args) < 1 {
		logger.Error("insufficient arguments for AnalyzedAuditBatchJob", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 1 argument, got %d", len(args))
	}

	dayToAnalyze := args[0]
	modelPlans, err := w.Store.ModelPlanCollection(logger, false)
	if err != nil {
		return err
	}

	// Create batch of AnalyzedAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Analyze models audits by date"
		batch.Success = faktory.NewJob(analyzedAuditBatchJobSuccessName, dayToAnalyze)
		batch.Success.Queue = criticalQueue

		logger = logger.With(logfields.BID(batch.Bid))
		logger.Info("Creating a new batch for the analyze audit batch job")

		return batch.Jobs(func() error {
			for _, mp := range modelPlans {
				innerLogger := logger.With(logfields.Date(dayToAnalyze), logfields.ModelPlanID(mp.ID))
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
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 1 {
		logger.Error("insufficient arguments for AnalyzedAuditBatchJobSuccess", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 1 argument, got %d", len(args))
	}

	dateAnalyzed := args[0]
	help := faktory_worker.HelperFor(ctx)
	// Kick off DigestEmailBatchJob
	return help.With(func(cl *faktory.Client) error {
		logger.Info("Analyzed Audit Batch Job was successful.")
		job := faktory.NewJob(digestEmailBatchJobName, dateAnalyzed)
		job.Queue = criticalQueue
		logger.Info("Pushing digest email batch job")
		return cl.Push(job)
	})
}
