package worker

import (
	"context"

	"go.uber.org/zap"
)

// RefreshOktaCronJob is the job the cron schedule to refresh okta token every 15 days
func (w *Worker) RefreshOktaCronJob(ctx context.Context, args ...interface{}) error {
	_, err := w.OktaAPIClient.SearchByName(context.Background(), "MINT")
	if err != nil {
		w.Logger.Warn("failed to use okta api token on API client creation", zap.Error(err))
	}
	w.Logger.Info("okta token refreshed")
	return nil
}
