package worker

import (
	"context"
	"fmt"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/logging"

	faktory "github.com/contribsys/faktory/client"
)

func RecoverFaktoryJobPanicAndLogError(ctx context.Context, returnedError *error) {
	if r := recover(); r != nil {
		*returnedError = fmt.Errorf("recovered from panic. Error: %v", r)

		//Future Improvement: Use logging middleware to automatically add faktory fields to the logger
		if ctx == nil {
			ctx = context.Background()
		}
		logger := appcontext.ZLogger(ctx)
		logger.Error("job panic recovered", zap.Error(*returnedError))
	}
}

// JobWithPanicProtection wraps a faktory Job in a wrapper function that will return an error instead of stopping the application.
func JobWithPanicProtection(jobFunc faktory_worker.Perform) faktory_worker.Perform {
	return func(ctx context.Context, args ...interface{}) (returnedError error) {
		defer RecoverFaktoryJobPanicAndLogError(ctx, &returnedError)
		jobErr := jobFunc(ctx, args...)
		if jobErr != nil {
			return jobErr
		}
		return returnedError

	}

}

// loggerWithFaktoryStandardFields will decorate a logger in faktory with standard fields. This should be called at the highest entry point and passed to child methods
// extraFields is a convenience param to add additional fields
// additional fields can be decorated later by simply calling logger.With
// jid is job id,
// job type is the type of job that is being run
func loggerWithFaktoryStandardFields[T logging.ChainableLogger[T]](logger T, jid string, jobType string, batchID *string, extraFields ...zapcore.Field) T {
	return logger.With(faktoryFields(jid, jobType, batchID, extraFields...)...)
}

// faktoryFields returns standard faktory fields for use in logging
func faktoryFields(jid string, jobType string, batchID *string, extraFields ...zapcore.Field) []zapcore.Field {
	//instantiate a traceID
	trace := uuid.New()
	fields := append([]zapcore.Field{
		logfields.FaktoryAppSection,
		logfields.JID(jid),
		logfields.JobType(jobType),
		logfields.TraceField(trace.String()),
	}, extraFields...)

	if batchID != nil {
		fields = append(fields, logfields.BID(*batchID))
	}
	return fields
}

// // RetryAwareLogger returns a logger that demotes Error->Warn if !final attempt.
// func RetryAwareLogger(ctx context.Context) *FaktoryLogger {
// 	// return FaktoryLoggerFromContext(ctx)
// 	// TODO implement this to get the logger from context
// 	return NewFaktoryLogger(zap.NewExample())
// 	// if isFinalAttempt(ctx) {
// 	// 	return logging.NewConditionalLogger(faktoryLogger.Zap(), true)
// 	// }
// 	// return logging.NewConditionalLogger(faktoryLogger.Zap(), false)
// }

func RetryAwareLogging() faktory_worker.MiddlewareFunc {
	return func(ctx context.Context, job *faktory.Job, next func(ctx context.Context) error) error {

		zLogger := appcontext.ZLogger(ctx)
		faktoryLogger := NewFaktoryLogger(zLogger)

		maxRetries := defaultMaxRetries
		if job.Retry != nil {
			maxRetries = *job.Retry
		}
		failCount := 0
		if job.Failure != nil {
			failCount = job.Failure.RetryCount
		}
		isFinal := failCount >= maxRetries

		// Get batch id if present
		// VERIFY THIS IS present
		var batchID *string
		if bid, ok := job.Custom["bid"].(string); ok {
			if bid != "" {
				batchID = &bid
			}
		}

		//TODO, can we use the job.RetryRemaining instead of getting maxRetries?

		// we don't know the batch ID yet
		faktoryLogger = loggerWithFaktoryStandardFields(faktoryLogger, job.Jid, job.Type, batchID,
			zap.Int("retry_count", failCount),
			zap.Int("max_retries", maxRetries),
			zap.Bool("is_final_attempt", isFinal),
			// zap.Int("retry_remaining", job.Failure.RetryRemaining),
			zap.String("faktory_queue", job.Queue),
		)

		// Put the flag in context so jobs/downstream can decide how to log
		ctx = withIsFinalAttempt(ctx, isFinal)

		// Decorate the ctx with the faktory logger
		ctx = withFaktoryLogger(ctx, faktoryLogger)

		// Run the job
		err := next(ctx)
		if err == nil {
			return nil
		}

		return err
	}
}

// context key so jobs can know if this run is final
type retryCtxKey struct{}

// context key to store faktory logger in context
type faktoryLoggerCtxKey struct{}

func withIsFinalAttempt(ctx context.Context, isFinal bool) context.Context {
	return context.WithValue(ctx, retryCtxKey{}, isFinal)
}

func IsFinalAttempt(ctx context.Context) bool {
	v := ctx.Value(retryCtxKey{})
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}

// withFaktoryLogger stores the FaktoryLogger in the context
func withFaktoryLogger(ctx context.Context, faktoryLogger *FaktoryLogger) context.Context {
	return context.WithValue(ctx, faktoryLoggerCtxKey{}, faktoryLogger)
}

// FaktoryLoggerFromContext retrieves the FaktoryLogger from the context, or creates a new one if not present
func FaktoryLoggerFromContext(ctx context.Context) *FaktoryLogger {
	v := ctx.Value(faktoryLoggerCtxKey{})
	if b, ok := v.(*FaktoryLogger); ok {
		return b
	}
	// If the logger isn't on the context, create a new one
	zlogger := appcontext.ZLogger(ctx)
	return NewFaktoryLogger(zlogger)

}
