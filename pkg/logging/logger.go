package logging

import (
	"go.uber.org/zap"
)

type ZapLogger struct {
	zap.Logger
}

func NewZapLogger(logger *zap.Logger) ZapLogger {
	return ZapLogger{*logger}
}
func NewZapLoggerPointer(logger *zap.Logger) *ZapLogger {
	return &ZapLogger{*logger}
}

// func NewZapSugaredLogger(slogger *zap.SugaredLogger ) *ZapLogger {
// 	slogger.
// 	return &ZapLogger{*logger}
// }

// func (l *ZapLogger) Sugar() ILogger {
// 	logger :=  l.Logger.Sugar()
// 	return &ZapLogger{logger}
// }

func (l *ZapLogger) Named(s string) ILogger {
	logger := l.Logger.Named(s)
	return &ZapLogger{*logger}
}

func (l *ZapLogger) WithOptions(opts ...zap.Option) ILogger {
	logger := l.Logger.WithOptions(opts...)
	return &ZapLogger{*logger}
}

func (l *ZapLogger) With(fields ...zap.Field) ILogger {
	logger := l.Logger.With(fields...)
	return &ZapLogger{*logger}
}

func (l *ZapLogger) WithLazy(fields ...zap.Field) ILogger {
	logger := l.Logger.WithLazy(fields...)
	return &ZapLogger{*logger}
}
func (l *ZapLogger) Zap() *zap.Logger {
	return &l.Logger
}

// ErrorOrWarn implemenets ILogger ErrorOrWarn by calling the Error method by default
func (l *ZapLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	l.Error(msg, fields...)
}
