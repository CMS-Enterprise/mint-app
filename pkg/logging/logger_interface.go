package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ILogger interface {
	// Sugar() ILogger
	Named(s string) ILogger
	WithOptions(opts ...zap.Option) ILogger
	With(fields ...zap.Field) ILogger
	WithLazy(fields ...zap.Field) ILogger
	Level() zapcore.Level
	Check(lvl zapcore.Level, msg string) *zapcore.CheckedEntry
	Log(lvl zapcore.Level, msg string, fields ...zap.Field)
	Debug(msg string, fields ...zap.Field)
	Info(msg string, fields ...zap.Field)
	Warn(msg string, fields ...zap.Field)
	Error(msg string, fields ...zap.Field)
	DPanic(msg string, fields ...zap.Field)
	Panic(msg string, fields ...zap.Field)
	Fatal(msg string, fields ...zap.Field)
	Sync() error
	Core() zapcore.Core
	Name() string
	Zap() *zap.Logger
}

func Whatever() {
	logger := zap.NewExample()
	logger.Core()

}
