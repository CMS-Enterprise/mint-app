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
	auditChangeKey = "change_id"
	modelPlanIDKey = "model_plan_id"
	dateKey        = "date"
	userIDKey      = "user_id"
)

// AuditChangeID provides the zap field for an audit change id
func AuditChangeID(changeID interface{}) zapcore.Field {
	return zap.Any(auditChangeKey, changeID)
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
