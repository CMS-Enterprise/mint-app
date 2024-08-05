package worker

import (
	"context"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/cmsgov/mint-app/pkg/apperrors"
)

// faktoryAppSectionField provides the zap field for specifying the part of the application is faktory
var faktoryAppSectionField = zap.String(appSectionKey, faktoryLoggingSection)

// these constants represents the keys to get these data fields out of a zap logger.
const (
	faktoryLoggingSection string = "faktory"
	appSectionKey         string = "app_section"

	batchIDKey string = "BID"
	jobIDKey   string = "JID"
	jobTypeKey string = "job_type"

	translatedAuditQueueIDKey = "translated_audit_queue_id"
	auditQueueAttemptsKey     = "audit_queue_attempts"
	auditChangeKey            = "change_id"
)

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
func TranslatedAuditIDZapField(translatedAuditQueueID uuid.UUID) zapcore.Field {
	return zap.Any(translatedAuditQueueIDKey, translatedAuditQueueID)
}
func auditChangeIDZapField(changeID interface{}) zapcore.Field {
	return zap.Any(auditChangeKey, changeID)
}
func auditQueueAttemptsField(attempts interface{}) zapcore.Field {
	return zap.Any(auditQueueAttemptsKey, attempts)
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

// loggerWithFaktoryFields decorated a faktory logger with standard fields using a faktory worker helper to provide the JID and BID
func loggerWithFaktoryFields(
	logger *zap.Logger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) *zap.Logger {

	return decorateFaktoryLoggerStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}
func loggerWithFaktoryFieldsAndBatchID(
	logger *zap.Logger,
	helper faktory_worker.Helper,
	extraFields ...zapcore.Field,
) *zap.Logger {

	extraFields = append(extraFields, BIDZapField(helper.Bid()))
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
