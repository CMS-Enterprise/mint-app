package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/cms-enterprise/mint-app/pkg/apperrors"
	"github.com/cms-enterprise/mint-app/pkg/logfields"

	faktory "github.com/contribsys/faktory/client"
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

// loggerWithFaktoryFieldsWithoutBatchID decorates a faktory logger with standard fields using a faktory worker helper to provide the JID, and JobType.
// it specifically excludes a batch id so it can be decorated separately later
// extraFields is a convenience param to add additional fields
// the underlying method calls loggerWithFaktoryStandardFields
func loggerWithFaktoryFieldsWithoutBatchID(
	logger *zap.Logger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) *zap.Logger {

	return loggerWithFaktoryStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// loggerWithFaktoryFields decorates a faktory logger with standard fields using a faktory worker helper to provide the JID, JobType, and BatchID
// extraFields is a convenience param to add additional fields
// the underlying method calls loggerWithFaktoryStandardFields
func loggerWithFaktoryFields(
	logger *zap.Logger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) *zap.Logger {

	extraFields = append(extraFields, logfields.BID(helper.Bid()))
	return loggerWithFaktoryStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// loggerWithFaktoryStandardFields will decorate a logger in faktory with standard fields. This should be called at the highest entry point and passed to child methods
// extraFields is a convenience param to add additional fields
// additional fields can be decorated later by simply calling logger.With
// jid is job id,
// job type is the type of job that is being run
func loggerWithFaktoryStandardFields(logger *zap.Logger, jid string, jobType string, extraFields ...zapcore.Field) *zap.Logger {
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

// RetryAwareLogging returns middleware that logs WARN if a failure will be retried,
// and ERROR only on the final failing attempt (i.e., no retries remain).
func RetryAwareLogging(logger *zap.Logger) faktory_worker.MiddlewareFunc {
	return func(ctx context.Context, job *faktory.Job, next func(ctx context.Context) error) error {
		help := faktory_worker.HelperFor(ctx)

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

		// Also emit your structured summary line
		log := loggerWithFaktoryFieldsWithoutBatchID(
			logger, help,
			zap.Int("fail_count_so_far", failCount),
			zap.Int("max_retries", maxRetries),
		)
		if isFinal {
			log.Error("job failed on final attempt; no retries remain", zap.Error(err))
		} else {
			log.Warn("job failed; will retry", zap.Error(err))
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

// downgradeErrorsCore wraps a Core and, when enabled, converts ERROR logs to WARN.
type downgradeErrorsCore struct {
	zapcore.Core
	downgrade bool
}

func (d *downgradeErrorsCore) With(fields []zapcore.Field) zapcore.Core {
	return &downgradeErrorsCore{Core: d.Core.With(fields), downgrade: d.downgrade}
}

func (d *downgradeErrorsCore) Check(ent zapcore.Entry, ce *zapcore.CheckedEntry) *zapcore.CheckedEntry {
	if d.downgrade && ent.Level == zapcore.ErrorLevel {
		ent.Level = zapcore.WarnLevel
	}
	return d.Core.Check(ent, ce)
}

// RetryAwareLogger returns a logger that demotes Error->Warn if !final attempt.
func RetryAwareLogger(ctx context.Context, base *zap.Logger) *zap.Logger {
	if isFinalAttempt(ctx) {
		return base // final run: keep ERRORs as ERROR
	}
	return base.WithOptions(zap.WrapCore(func(c zapcore.Core) zapcore.Core {
		return &downgradeErrorsCore{Core: c, downgrade: true}
	}))
}
