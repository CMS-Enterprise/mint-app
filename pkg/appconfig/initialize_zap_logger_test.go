package appconfig

import (
	"testing"

	"go.uber.org/zap/zapcore"
)

func TestMustInitializeLogger_DeployedEnvironment(t *testing.T) {
	env := prodEnv
	logger := MustInitializeLogger(env)

	if logger == nil {
		t.Fatal("expected logger to not be nil")
	}
	if !logger.Core().Enabled(zapcore.InfoLevel) {
		t.Error("expected InfoLevel to be enabled")
	}
}

func TestMustInitializeLogger_LocalEnvironment(t *testing.T) {
	env := localEnv
	logger := MustInitializeLogger(env)

	if logger == nil {
		t.Fatal("expected logger to not be nil")
	}
	if !logger.Core().Enabled(zapcore.DebugLevel) {
		t.Error("expected DebugLevel to be enabled")
	}
}

func TestInitializeZapLogger_NonDeployedEnvironment_UsesDebugLevel(t *testing.T) {
	env := localEnv
	logger, err := initializeZapLogger(env)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if logger == nil {
		t.Fatal("expected logger to not be nil")
	}
	if !logger.Core().Enabled(zapcore.DebugLevel) {
		t.Error("expected DebugLevel to be enabled")
	}
}

func TestInitializeZapLogger_DeployedEnvironment_UsesProductionConfig(t *testing.T) {
	env := prodEnv
	logger, err := initializeZapLogger(env)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if logger == nil {
		t.Fatal("expected logger to not be nil")
	}
	if !logger.Core().Enabled(zapcore.InfoLevel) {
		t.Error("expected InfoLevel to be enabled")
	}
	if logger.Core().Enabled(zapcore.DebugLevel) {
		t.Error("expected DebugLevel to be disabled")
	}
}

func TestInitializeZapLogger_StagingEnvironment_UsesProductionConfig(t *testing.T) {
	env := implEnv
	logger, err := initializeZapLogger(env)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if logger == nil {
		t.Fatal("expected logger to not be nil")
	}
	if !logger.Core().Enabled(zapcore.InfoLevel) {
		t.Error("expected InfoLevel to be enabled")
	}
}
