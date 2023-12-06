package services

import (
	"github.com/facebookgo/clock"
	ld "github.com/launchdarkly/go-server-sdk/v6"
	"go.uber.org/zap"
)

// NewConfig returns a Config for services
func NewConfig(logger *zap.Logger, ldc *ld.LDClient) Config {
	return Config{
		clock:    clock.New(),
		logger:   logger,
		ldClient: ldc,
	}
}

// Config holds common configured object for services
type Config struct {
	clock    clock.Clock
	logger   *zap.Logger
	ldClient *ld.LDClient
}
