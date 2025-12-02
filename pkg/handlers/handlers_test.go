package handlers

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
)

type HandlerTestSuite struct {
	suite.Suite
	Context context.Context
	logger  *zap.Logger
	base    HandlerBase
}

func TestHandlerTestSuite(t *testing.T) {
	logger := zap.NewNop()
	handlerTestSuite := &HandlerTestSuite{
		Suite:   suite.Suite{},
		Context: appcontext.WithLogger(context.Background(), logger),
		logger:  logger,
		base:    NewHandlerBase(),
	}
	suite.Run(t, handlerTestSuite)
}
