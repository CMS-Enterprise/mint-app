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
	modelPlanIDKey            = "model_plan_id"
	dateKey                   = "date"
	userIDKey                 = "userID"
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

// TranslatedAuditQueueIDZapField provides the zap field for a TranslatedAuditQueueID
func TranslatedAuditQueueIDZapField(translatedAuditQueueID uuid.UUID) zapcore.Field {
	return zap.Any(translatedAuditQueueIDKey, translatedAuditQueueID)
}

// auditChangeIDZapField provides the zap field for an audit change id
func auditChangeIDZapField(changeID interface{}) zapcore.Field {
	return zap.Any(auditChangeKey, changeID)
}

// auditQueueAttemptsZapField provides the zap field for the number of attempts
func auditQueueAttemptsZapField(attempts interface{}) zapcore.Field {
	return zap.Any(auditQueueAttemptsKey, attempts)
}

// dateZapField provides the zap field for the date
func dateZapField(date interface{}) zapcore.Field {
	return zap.Any(dateKey, date)
}

// modelPlanIDZapField provides the zap field for the modelPlanID
func modelPlanIDZapField(modelPlanID uuid.UUID) zapcore.Field {
	return zap.Any(modelPlanIDKey, modelPlanID)
}

// userIDZapField provides the zap field for the userID
func userIDZapField(userID uuid.UUID) zapcore.Field {
	return zap.Any(userIDKey, userID)
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

	extraFields = append(extraFields, BIDZapField(helper.Bid()))
	return loggerWithFaktoryStandardFields(logger, helper.Jid(), helper.JobType(), extraFields...)
}

// loggerWithFaktoryStandardFields will decorate a logger in faktory with standard fields. This should be called at the highest entry point and passed to child methods
// extraFields is a convenience param to add additional fields
// additional fields can be decorated later by simply calling logger.With
// jid is job id,
// job type is the type of job that is being run
func loggerWithFaktoryStandardFields(logger *zap.Logger, jid string, jobType string, extraFields ...zapcore.Field) *zap.Logger {
	fields := append([]zapcore.Field{
		faktoryAppSectionField,
		JIDZapField(jid),
		JobTypeZapField(jobType),
	}, extraFields...)
	return logger.With(fields...)
}
