package appconfig

import (
	"log"

	"go.uber.org/zap"
)

// MustInitializeLogger initializes a zap.Logger based on the given environment.
// if there is an error during initialization, it will log the error and exit the application.
func MustInitializeLogger(environment Environment) *zap.Logger {
	logger, err := initializeZapLogger(environment)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	return logger
}

// initializeZapLogger initializes a zap.Logger based on the given environment.
func initializeZapLogger(environment Environment) (*zap.Logger, error) {
	var zapLogger *zap.Logger
	var err error
	if !environment.Deployed() {
		// For local development: use JSON format like production but with debug level logging
		config := zap.NewProductionConfig()
		// Setting this at Development adds more stack trace info
		config.Development = true
		config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
		zapLogger, err = config.Build()
	} else {
		zapLogger, err = zap.NewProduction()
	}

	return zapLogger, err
}
