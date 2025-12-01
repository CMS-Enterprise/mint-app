package logging

import (
	"testing"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"
)

func TestZapLogger_WithOptions(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewZapLogger(zap.New(core))

	result := logger.WithOptions(zap.AddCaller())

	if result == nil {
		t.Fatal("expected WithOptions to return non-nil logger")
	}
	if result != logger {
		t.Error("expected WithOptions to return the same ZapLogger instance")
	}
}

func TestZapLogger_ErrorOrWarn(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	logger := NewZapLogger(zap.New(core))

	logger.ErrorOrWarn("test message", zap.String("key", "value"))

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}
	entry := logs.All()[0]
	if entry.Level != zapcore.ErrorLevel {
		t.Errorf("expected Error level, got %v", entry.Level)
	}
	if entry.Message != "test message" {
		t.Errorf("expected 'test message', got %q", entry.Message)
	}
}

func TestZapLogger_Named_ReturnsCorrectType(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewZapLogger(zap.New(core))

	result := logger.Named("test")

	if result == nil {
		t.Fatal("expected Named to return non-nil logger")
	}
	if result != logger {
		t.Error("expected Named to return the same ZapLogger instance")
	}
	if result.Name() != "test" {
		t.Errorf("expected name 'test', got %q", result.Name())
	}
}

func TestZapLogger_With_ReturnsCorrectType(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewZapLogger(zap.New(core))

	result := logger.With(zap.String("key", "value"))

	if result == nil {
		t.Fatal("expected With to return non-nil logger")
	}
	if result != logger {
		t.Error("expected With to return the same ZapLogger instance")
	}
}

func TestZapLogger_With_IncludesFieldsInLogs(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	logger := NewZapLogger(zap.New(core))

	wrappedLogger := logger.With(zap.String("context", "test-context"), zap.Int("request_id", 123))
	wrappedLogger.Info("test message")

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}

	entry := logs.All()[0]
	if entry.Message != "test message" {
		t.Errorf("expected message 'test message', got %q", entry.Message)
	}

	// Verify that the fields added with With() are present in the log
	contextMap := entry.ContextMap()
	if contextMap["context"] != "test-context" {
		t.Errorf("expected context field 'test-context', got %v", contextMap["context"])
	}
	if contextMap["request_id"] != int64(123) {
		t.Errorf("expected request_id field 123, got %v", contextMap["request_id"])
	}
}

func TestZapLogger_AddCallerSkip(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	baseLogger := zap.New(core, zap.AddCaller())
	logger := NewZapLogger(baseLogger)

	logger.Info("test message")

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}
	entry := logs.All()[0]
	if entry.Caller.Function == "" {
		t.Error("expected caller information to be present")
	}
}
