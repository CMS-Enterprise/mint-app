package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/cmsgov/mint-app/pkg/apperrors"
)

// JobWithPanicProtection wraps a faktory Job in a wrapper function that will return an error instead of stopping the application.
func JobWithPanicProtection(jobFunc faktory_worker.Perform) faktory_worker.Perform {
	return func(ctx context.Context, args ...interface{}) (returnedError error) {
		defer apperrors.RecoverPanicAsErrorFunction(&returnedError)
		jobErr := jobFunc(ctx, args...)
		if jobErr != nil {
			return jobErr
		}
		return returnedError

	}

}
