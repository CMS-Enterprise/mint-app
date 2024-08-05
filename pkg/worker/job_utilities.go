package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/cmsgov/mint-app/pkg/apperrors"
)

const faktoryLoggingSection string = "faktory"
const appSectionKey string = "app_section"

// faktoryAppSectionField provides the zap field for specifying the part of the application is faktory
var faktoryAppSectionField = zap.String(appSectionKey, faktoryLoggingSection)

const batchIDKey string = "BID"
const jobIDKey string = "JID"
const jobTypeKey string = "job_type"

// BIDZapField returns the zap core field for a worker BatchID
func BIDZapField(bid string) zapcore.Field {
	return zap.String(batchIDKey, bid)
}

// JIDZapField returns the zap core field for a worker JobID
func JIDZapField(jid string) zapcore.Field {
	return zap.String(jobIDKey, jid)
}

// JobTypeZapField returns the zap core field for a worker job type
func JobTypeZapField(jobType string) zapcore.Field {
	return zap.String(jobTypeKey, jobType)
}

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

// decorateFaktoryLoggerStandardFieldsWithHelper decorated a faktory logger with standard fields using a faktory worker helper to provide the JID and BID
func decorateFaktoryLoggerStandardFieldsWithHelper(logger *zap.Logger, helper faktory_worker.Helper, includeBID bool, extraFields ...zapcore.Field) *zap.Logger {

	if includeBID {
		extraFields = append(extraFields, BIDZapField(helper.Bid()))
	}
	return decorateFaktoryLoggerStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// decorateFaktoryLoggerStandardFields will decorate a logger in faktory with standard fields. This should be called at the highest entry point and passed to child methods
// additional fields can be decorated later by simply calling logger.With
// jid is job id,
// job type is the type of job that is being run
func decorateFaktoryLoggerStandardFields(logger *zap.Logger, jid string, jobType string, extraFields ...zapcore.Field) *zap.Logger {
	fields := append([]zapcore.Field{
		faktoryAppSectionField,
		JIDZapField(jid),
		JobTypeZapField(jobType),
	}, extraFields...)
	return logger.With(fields...)
}
