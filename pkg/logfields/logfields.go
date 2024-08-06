// Package logfields provides a standard location for field names we expect in logs
package logfields

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// traceFieldKey is the key to check the trace of a logging chain
const traceFieldKey string = "traceID"

func TraceField(traceID string) zapcore.Field {
	return zap.String(traceFieldKey, traceID)
}
