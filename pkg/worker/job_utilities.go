package worker

import (
	"context"
	"fmt"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
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

// loggerWithFaktoryFieldsWithoutBatchID decorates a faktory logger with standard fields using a faktory worker helper to provide the JID, and JobType.
// it specifically excludes a batch id so it can be decorated separately later
// extraFields is a convenience param to add additional fields
// the underlying method calls loggerWithFaktoryStandardFields
func loggerWithFaktoryFieldsWithoutBatchID(
	logger logging.ILogger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) logging.ILogger {

	return loggerWithFaktoryStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// loggerWithFaktoryFields decorates a faktory logger with standard fields using a faktory worker helper to provide the JID, JobType, and BatchID
// extraFields is a convenience param to add additional fields
// the underlying method calls loggerWithFaktoryStandardFields
func loggerWithFaktoryFields(
	logger logging.ILogger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) logging.ILogger {

	extraFields = append(extraFields, logfields.BID(helper.Bid()))
	return loggerWithFaktoryStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// loggerWithFaktoryStandardFields will decorate a logger in faktory with standard fields. This should be called at the highest entry point and passed to child methods
// extraFields is a convenience param to add additional fields
// additional fields can be decorated later by simply calling logger.With
// jid is job id,
// job type is the type of job that is being run
func loggerWithFaktoryStandardFields(logger logging.ILogger, jid string, jobType string, extraFields ...zapcore.Field) logging.ILogger {
	//instantiate a traceID
	trace := uuid.New()
	fields := append([]zapcore.Field{
		logfields.FaktoryAppSection,
		logfields.JID(jid),
		logfields.JobType(jobType),
		logfields.TraceField(trace.String()),
	}, extraFields...)
	return logger.With(fields...)
}

// RetryAwareLogger returns a logger that demotes Error->Warn if !final attempt.
func RetryAwareLogger(ctx context.Context, conditionalLogger *logging.ConditionalLogger) *logging.ConditionalLogger {
	if isFinalAttempt(ctx) {
		return logging.NewConditionalLogger(conditionalLogger.Zap(), true)
	}
	return logging.NewConditionalLogger(conditionalLogger.Zap(), false)
}

func RetryAwareLogging() faktory_worker.MiddlewareFunc {
	return func(ctx context.Context, job *faktory.Job, next func(ctx context.Context) error) error {

		maxRetries := defaultMaxRetries
		if job.Retry != nil {
			maxRetries = *job.Retry
		}
		failCount := 0
		if job.Failure != nil {
			failCount = job.Failure.RetryCount
		}
		isFinal := failCount >= maxRetries

		// Put the flag in context so jobs/downstream can decide how to log
		ctx = withIsFinalAttempt(ctx, isFinal)

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

func withIsFinalAttempt(ctx context.Context, isFinal bool) context.Context {
	return context.WithValue(ctx, retryCtxKey{}, isFinal)
}

func isFinalAttempt(ctx context.Context) bool {
	v := ctx.Value(retryCtxKey{})
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}
