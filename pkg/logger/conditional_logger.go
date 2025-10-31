package logger

import "go.uber.org/zap"

type ConditionalLogger struct {
	shouldError bool
	zap.Logger
}

//TODO, determine if we want to keep both Error and ErrorOrWarn methods, perhaps add to the interface?

func (l *ConditionalLogger) Error(msg string, fields ...zap.Field) {
	if l.shouldError {
		l.Logger.Error(msg, fields...)
	} else {
		l.Warn(msg, fields...)
	}
}

func (l *ConditionalLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	if l.shouldError {
		l.Logger.Error(msg, fields...)
	} else {
		l.Warn(msg, fields...)
	}
}
