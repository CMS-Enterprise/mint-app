package logging

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"

	"go.uber.org/zap"
)

// TODO: Ask Clay about the ContextTestSuite
type ContextTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestContextTestSuite(t *testing.T) {
	contextTestSuite := &ContextTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, contextTestSuite)
}

func TestProvideZLogger(t *testing.T) {
	// functional logger returned even when not set
	fallback := ProvideLogger(context.Background())
	fallback.Info("silently succeeds") // not nil
}
