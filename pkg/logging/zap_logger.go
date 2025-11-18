package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ZapLogger struct {
	Logger *zap.Logger
}

func NewZapLogger(logger *zap.Logger) *ZapLogger {
	return &ZapLogger{logger.WithOptions(zap.AddCallerSkip(1))}
}

func (l *ZapLogger) Named(s string) *ZapLogger {
	l.Logger = l.Logger.Named(s)
	return l
}

func (l *ZapLogger) WithOptions(opts ...zap.Option) *ZapLogger {
	l.Logger = l.Logger.WithOptions(opts...)
	return l
}

func (l *ZapLogger) With(fields ...zap.Field) *ZapLogger {
	l.Logger = l.Logger.With(fields...)
	return l
}

func (l *ZapLogger) Level() zapcore.Level {
	return l.Logger.Level()
}

func (l *ZapLogger) Check(lvl zapcore.Level, msg string) *zapcore.CheckedEntry {
	return l.Logger.Check(lvl, msg)
}

func (l *ZapLogger) Log(lvl zapcore.Level, msg string, fields ...zap.Field) {
	l.Logger.Log(lvl, msg, fields...)
}

func (l *ZapLogger) Debug(msg string, fields ...zap.Field) {
	l.Logger.Debug(msg, fields...)
}

func (l *ZapLogger) Info(msg string, fields ...zap.Field) {
	l.Logger.Info(msg, fields...)
}

func (l *ZapLogger) Warn(msg string, fields ...zap.Field) {
	l.Logger.Warn(msg, fields...)
}

func (l *ZapLogger) Error(msg string, fields ...zap.Field) {
	l.Logger.Error(msg, fields...)
}

func (l *ZapLogger) DPanic(msg string, fields ...zap.Field) {
	l.Logger.DPanic(msg, fields...)
}

func (l *ZapLogger) Panic(msg string, fields ...zap.Field) {
	l.Logger.Panic(msg, fields...)
}

func (l *ZapLogger) Fatal(msg string, fields ...zap.Field) {
	l.Logger.Fatal(msg, fields...)
}

func (l *ZapLogger) Sync() error {
	return l.Logger.Sync()
}

func (l *ZapLogger) Core() zapcore.Core {
	return l.Logger.Core()
}

func (l *ZapLogger) Name() string {
	return l.Logger.Name()
}
func (l *ZapLogger) LoggerType() LoggerType {
	return LoggerTypeZap
}

func (l *ZapLogger) Underlying() (any, LoggerType) {
	return l.Logger, l.LoggerType()
}

func (l *ZapLogger) Zap() *zap.Logger {
	return l.Logger
}

// ErrorOrWarn logs a message at Error level. It Satisfies the ErrorOrWarnLogger interface.
func (l *ZapLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	l.Logger.Error(msg, fields...)
}

// Interface compliance checks
var _ ILogger = (*ZapLogger)(nil)
var _ ChainableLogger[*ZapLogger] = (*ZapLogger)(nil)
var _ ErrorOrWarnLogger = (*ZapLogger)(nil)
var _ ChainableErrorOrWarnLogger[*ZapLogger] = (*ZapLogger)(nil)
