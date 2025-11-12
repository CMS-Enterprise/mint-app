package logging

import "go.uber.org/zap"

type ConditionalLogger struct {
	shouldError bool
	ZapLogger
}

func NewConditionalLogger(logger *zap.Logger, shouldError bool) *ConditionalLogger {
	return &ConditionalLogger{
		ZapLogger:   *NewZapLogger(logger),
		shouldError: shouldError,
	}
}

func (l *ConditionalLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	if l.shouldError {
		l.Error(msg, fields...)
	} else {
		l.Warn(msg, fields...)
	}
}

func (l *ConditionalLogger) Zap() *zap.Logger {
	return l.ZapLogger.Zap()
}
