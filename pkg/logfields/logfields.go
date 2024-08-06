// Package logfields provides a standard location for field names we expect in logs
package logfields

import (
	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// TraceFieldKey is the key to check the trace of a logging chain
const TraceFieldKey string = "traceID"

func TraceField(traceID string) zapcore.Field {
	return zap.String(TraceFieldKey, traceID)
}

// these constants represents the keys to get these data fields out of a zap logger.
const (
	BatchIDKey string = "BID"
	JobIDKey   string = "JID"
	JobTypeKey string = "job_type"

	translatedAuditQueueIDKey = "translated_audit_queue_id"
	auditQueueAttemptsKey     = "audit_queue_attempts"
	auditChangeKey            = "change_id"
	modelPlanIDKey            = "model_plan_id"
	dateKey                   = "date"
	userIDKey                 = "user_id"
)

// BID returns the zap core field for a worker BatchID
func BID(bid string) zapcore.Field {
	return zap.String(BatchIDKey, bid)
}

// JID returns the zap core field for a worker JobID
func JID(jid string) zapcore.Field {
	return zap.String(JobIDKey, jid)
}

// JobType returns the zap core field for a worker job type
func JobType(jobType string) zapcore.Field {
	return zap.String(JobTypeKey, jobType)
}

// TranslatedAuditQueueID provides the zap field for a TranslatedAuditQueueID
func TranslatedAuditQueueID(translatedAuditQueueID uuid.UUID) zapcore.Field {
	return zap.Any(translatedAuditQueueIDKey, translatedAuditQueueID)
}

// AuditChangeID provides the zap field for an audit change id
func AuditChangeID(changeID interface{}) zapcore.Field {
	return zap.Any(auditChangeKey, changeID)
}

// AuditQueueAttempts provides the zap field for the number of attempts
func AuditQueueAttempts(attempts interface{}) zapcore.Field {
	return zap.Any(auditQueueAttemptsKey, attempts)
}

// Date provides the zap field for the date
func Date(date interface{}) zapcore.Field {
	return zap.Any(dateKey, date)
}

// ModelPlanID provides the zap field for the modelPlanID
func ModelPlanID(modelPlanID uuid.UUID) zapcore.Field {
	return zap.Any(modelPlanIDKey, modelPlanID)
}

// UserID provides the zap field for the userID
func UserID(userID uuid.UUID) zapcore.Field {
	return zap.Any(userIDKey, userID)
}
