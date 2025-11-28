package worker

import (
	"context"

	"go.uber.org/zap"
)

const (
	refreshOktaCronJobName string = "RefreshOktaCronJob"
)

// RefreshOktaCronJob is the job the cron schedule to refresh okta token every 15 days
func (w *Worker) RefreshOktaCronJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	_, err := w.OktaAPIClient.SearchByName(ctx, "MINT")
	if err != nil {
		logger.Warn("failed to refresh okta token", zap.Error(err))
		return err
	}

	logger.Info("okta token refreshed")
	return nil
}
