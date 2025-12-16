package logfields

import (
	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// these constants represents the common keys used in the faktory job section of the app. They are used as the key when logging data in a zap logger
const (
	BatchIDKey        string = "BID"
	JobIDKey          string = "JID"
	JobTypeKey        string = "job_type"
	RetryCountKey     string = "retry_count"
	MaxRetriesKey     string = "max_retries"
	IsFinalAttemptKey string = "is_final_attempt"
	FaktoryQueueKey   string = "faktory_queue"

	translatedAuditQueueIDKey = "translated_audit_queue_id"
	auditQueueAttemptsKey     = "audit_queue_attempts"
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

// RetryCount returns the zap core field for a worker retry count
func RetryCount(retryCount int) zapcore.Field {
	return zap.Int(RetryCountKey, retryCount)
}

// MaxRetries returns the zap core field for a worker max retries
func MaxRetries(maxRetries int) zapcore.Field {
	return zap.Int(MaxRetriesKey, maxRetries)
}

// IsFinalAttempt returns the zap core field for a worker is final attempt
func IsFinalAttempt(isFinal bool) zapcore.Field {
	return zap.Bool(IsFinalAttemptKey, isFinal)
}

// FaktoryQueue provides the zap field for a FaktoryQueue
func FaktoryQueue(faktoryQueue string) zapcore.Field {
	return zap.String(FaktoryQueueKey, faktoryQueue)
}

// TranslatedAuditQueueID provides the zap field for a TranslatedAuditQueueID
func TranslatedAuditQueueID(translatedAuditQueueID uuid.UUID) zapcore.Field {
	return zap.Any(translatedAuditQueueIDKey, translatedAuditQueueID)
}

// AuditQueueAttempts provides the zap field for the number of attempts
func AuditQueueAttempts(attempts interface{}) zapcore.Field {
	return zap.Any(auditQueueAttemptsKey, attempts)
}
