package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/logfields"
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
	fields := append([]zapcore.Field{
		logfields.FaktoryAppSection,
		logfields.JID(jid),
		logfields.JobType(jobType),
	}, extraFields...)
	return logger.With(fields...)
}
