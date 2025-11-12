package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ZapLogger struct {
	logger *zap.Logger
}

func NewZapLogger(logger *zap.Logger) *ZapLogger {
	return &ZapLogger{logger}
}

func (l *ZapLogger) Named(s string) ILogger {
	return &ZapLogger{l.logger.Named(s)}
}

func (l *ZapLogger) WithOptions(opts ...zap.Option) ILogger {
	return &ZapLogger{l.logger.WithOptions(opts...)}
}

func (l *ZapLogger) With(fields ...zap.Field) ILogger {
	return &ZapLogger{l.logger.With(fields...)}
}

func (l *ZapLogger) Level() zapcore.Level {
	return l.logger.Level()
}

func (l *ZapLogger) Check(lvl zapcore.Level, msg string) *zapcore.CheckedEntry {
	return l.logger.Check(lvl, msg)
}

func (l *ZapLogger) Log(lvl zapcore.Level, msg string, fields ...zap.Field) {
	l.logger.Log(lvl, msg, fields...)
}

func (l *ZapLogger) Debug(msg string, fields ...zap.Field) {
	l.logger.Debug(msg, fields...)
}

func (l *ZapLogger) Info(msg string, fields ...zap.Field) {
	l.logger.Info(msg, fields...)
}

func (l *ZapLogger) Warn(msg string, fields ...zap.Field) {
	l.logger.Warn(msg, fields...)
}

func (l *ZapLogger) Error(msg string, fields ...zap.Field) {
	l.logger.Error(msg, fields...)
}

func (l *ZapLogger) DPanic(msg string, fields ...zap.Field) {
	l.logger.DPanic(msg, fields...)
}

func (l *ZapLogger) Panic(msg string, fields ...zap.Field) {
	l.logger.Panic(msg, fields...)
}

func (l *ZapLogger) Fatal(msg string, fields ...zap.Field) {
	l.logger.Fatal(msg, fields...)
}

func (l *ZapLogger) Sync() error {
	return l.logger.Sync()
}

func (l *ZapLogger) Core() zapcore.Core {
	return l.logger.Core()
}

func (l *ZapLogger) Name() string {
	return l.logger.Name()
}
func (l *ZapLogger) LoggerType() LoggerType {
	return LoggerTypeZap
}

func (l *ZapLogger) Underlying() (any, LoggerType) {
	return l.logger, l.LoggerType()
}

func (l *ZapLogger) Zap() *zap.Logger {
	return l.logger
}

func (l *ZapLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	l.logger.Error(msg, fields...)
}
