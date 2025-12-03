package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// ILogger is the interface that wraps the basic logging methods. It follows the zap.Logger method signatures.
type ILogger interface {
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
}

// ErrorOrWarnLogger is an interface that extends ILogger with ErrorOrWarn method.
type ErrorOrWarnLogger interface {
	ILogger

	// ErrorOrWarn logs a message at Error level conditionally if certain conditions are met. Determined by the implementation
	ErrorOrWarn(msg string, fields ...zap.Field)
}

// ChainableLogger is a generic interface that extends ILogger with chainable methods.
type ChainableLogger[T any] interface {
	ILogger

	// chainable methods
	Named(s string) T
	WithOptions(opts ...zap.Option) T
	With(fields ...zap.Field) T

	// // optional convenience
	// Self() *zap.Logger
}

type ChainableErrorOrWarnLogger[T any] interface {
	ErrorOrWarnLogger
	ChainableLogger[T]
}

type LoggerType string

const (
	// LoggerTypeZap is the logger type for zap
	LoggerTypeZap LoggerType = "zap"
)
