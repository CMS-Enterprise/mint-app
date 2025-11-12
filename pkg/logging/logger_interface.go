package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ILogger interface {
	Named(s string) ILogger
	WithOptions(opts ...zap.Option) ILogger
	With(fields ...zap.Field) ILogger
	Level() zapcore.Level
	Check(lvl zapcore.Level, msg string) *zapcore.CheckedEntry
	Log(lvl zapcore.Level, msg string, fields ...zap.Field)
	Debug(msg string, fields ...zap.Field)
	Info(msg string, fields ...zap.Field)
	Warn(msg string, fields ...zap.Field)
	ErrorOrWarn(msg string, fields ...zap.Field)
	Error(msg string, fields ...zap.Field)
	DPanic(msg string, fields ...zap.Field)
	Panic(msg string, fields ...zap.Field)
	Fatal(msg string, fields ...zap.Field)
	Sync() error
	Core() zapcore.Core
	Name() string
	LoggerType() LoggerType
	Underlying() (any, LoggerType)
	// Zap returns the underlying zap.Logger. This is a convenience method that should be replaced in favor of using the interface
	Zap() *zap.Logger
}

type LoggerType string

const (
	// LoggerTypeZap is the logger type for zap
	LoggerTypeZap LoggerType = "zap"
)
