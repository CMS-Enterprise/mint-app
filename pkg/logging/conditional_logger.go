package logging

import "go.uber.org/zap"

// ConditionalLogger is a logger that logs Error or Warn based on a condition.
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

func (l *ConditionalLogger) Named(s string) *ConditionalLogger {
	l.Logger = l.Logger.Named(s)
	return l
}

func (l *ConditionalLogger) WithOptions(opts ...zap.Option) *ConditionalLogger {
	l.Logger = l.Logger.WithOptions(opts...)
	return l
}

func (l *ConditionalLogger) With(fields ...zap.Field) *ConditionalLogger {
	l.Logger = l.Logger.With(fields...)
	return l
}

// ErrorOrWarn logs a message at Error level if shouldError is true, otherwise at Warn level.
func (l *ConditionalLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	if l.shouldError {
		l.Error(msg, fields...)
	} else {
		l.Warn(msg, fields...)
	}
}

// Interface compliance checks
var _ ILogger = (*ConditionalLogger)(nil)
var _ ChainableLogger[*ConditionalLogger] = (*ConditionalLogger)(nil)
var _ ErrorOrWarnLogger = (*ConditionalLogger)(nil)
var _ ChainableErrorOrWarnLogger[*ConditionalLogger] = (*ConditionalLogger)(nil)
