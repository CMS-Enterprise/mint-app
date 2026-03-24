package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const (
	updateUserAccountCronJobName  string = "UpdateUserAccountCronJob"
	updateUserAccountBatchJobName string = "UpdateUserAccountBatchJob"
	updateUserAccountJobName      string = "UpdateUserAccountJob"
)

// Max retries for jobs we enqueue ourselves (cron -> batch -> per-user jobs).
// Faktory's retry count includes the first attempt; e.g. maxRetries=2 => 2 total attempts.
var (
	updateUserAccountBatchJobMaxRetry = 3
	updateUserAccountJobMaxRetry      = 3
)

// updateUserAccountFromOkta is a seam for unit tests.
// Production delegates to resolvers.UpdateUserAccountFromOkta.
var updateUserAccountFromOkta = func(
	ctx context.Context,
	store *storage.Store,
	oktaClient oktaapi.Client,
	logger *FaktoryLogger,
	username string,
) error {
	return resolvers.UpdateUserAccountFromOkta[*FaktoryLogger](ctx, store, oktaClient, logger, username)
}

// UpdateUserAccountCronJob is the cron-triggered entry point that pushes the batch job
func (w *Worker) UpdateUserAccountCronJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(updateUserAccountBatchJobName, "")
		job.Queue = criticalQueue
		job.Retry = &updateUserAccountBatchJobMaxRetry
		return cl.Push(job)
	})
}

// UpdateUserAccountBatchJob fetches all user accounts and enqueues one UpdateUserAccountJob per user
func (w *Worker) UpdateUserAccountBatchJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("getting collection of user accounts to update")

	users, err := storage.UserAccountCollectionGet(w.Store)
	if err != nil {
		logger.ErrorOrWarn("unable to get user account collection for the update user account batch job", zap.Error(err))
		return err
	}

	return helper.With(func(cl *faktory.Client) error {
		for _, user := range users {
			if user.Username == nil {
				continue
			}
			jobLogger := logger.With(logfields.UserID(user.ID))
			job := faktory.NewJob(updateUserAccountJobName, *user.Username)
			job.Queue = criticalQueue
			job.Retry = &updateUserAccountJobMaxRetry
			if err := cl.Push(job); err != nil {
				jobLogger.ErrorOrWarn("issue pushing update user account job", zap.Error(err))
				return fmt.Errorf("error pushing UpdateUserAccountJob for userID %v: %w", user.ID, err)
			}
		}
		return nil
	})
}

// UpdateUserAccountJob fetches updated user info from Okta and persists it for a single user
// args[0] username (string)
func (w *Worker) UpdateUserAccountJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 1 {
		err := fmt.Errorf("no arguments were provided for this job")
		logger.ErrorOrWarn(err.Error(), zap.Error(err))
		return err
	}

	username := fmt.Sprint(args[0])
	return updateUserAccountFromOkta(ctx, w.Store, w.OktaAPIClient, logger, username)
}
