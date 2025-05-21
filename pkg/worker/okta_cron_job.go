package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
)

// RefreshOktaCronJob is the job the cron schedule to refresh okta token every 15 days
func (w *Worker) RefreshOktaCronJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsWithoutBatchID(w.Logger, helper)

	_, err := w.OktaAPIClient.SearchByName(ctx, "MINT")
	if err != nil {
		logger.Warn("failed to refresh okta token", zap.Error(err))
		return err
	}

	logger.Info("okta token refreshed")
	return nil
}
