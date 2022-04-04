package appcontext

import (
	"context"
	"testing"

	"github.com/cmsgov/mint-app/pkg/shared/appcontext/constants"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

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

func (s ContextTestSuite) TestProvideWithLogger() {
	ctx := context.Background()
	expectedLogger := zap.NewNop()

	ctx = ProvideWithLogger(ctx, expectedLogger)
	logger := ctx.Value(constants.LoggerKey).(*zap.Logger)

	s.Equal(expectedLogger, logger)
}

func (s ContextTestSuite) TestProvideWithTrace() {
	ctx, tID := ProvideWithRequestTrace(context.Background())
	traceID := ctx.Value(constants.TraceKey).(uuid.UUID)

	s.NotEqual(uuid.UUID{}, traceID)
	s.Equal(tID, traceID)
}

// TODO: Isolate Trace logic
func (s ContextTestSuite) TestTrace() {
	ctx := context.Background()
	expectedID := uuid.New()
	ctx = context.WithValue(ctx, constants.TraceKey, expectedID)

	traceID, ok := GetContextTrace(ctx)

	s.True(ok)
	s.Equal(expectedID, traceID)
}

func TestContextPrincipal(t *testing.T) {
	// Arrange (of AAA)
	submitterID := "submitter"
	reviewerID := "reviewer"

	testCases := map[string]struct {
		ctx         context.Context
		expectID    string
		expectMINT  bool
		expectADMIN bool
	}{
		"unassigned returns anonymous": {
			ctx:         context.Background(),
			expectID:    "ANON",
			expectMINT:  false,
			expectADMIN: false,
		},
		"regular user": {
			ctx: ProvideWithSecurityPrincipal(context.Background(), &authentication.EUAPrincipal{
				EUAID:        submitterID,
				JobCodeMINT:  true,
				JobCodeADMIN: false,
			}),
			expectID:    submitterID,
			expectMINT:  true,
			expectADMIN: false,
		},
		"admin User": {
			ctx: ProvideWithSecurityPrincipal(context.Background(), &authentication.EUAPrincipal{
				EUAID:        reviewerID,
				JobCodeMINT:  true,
				JobCodeADMIN: true,
			}),
			expectID:    reviewerID,
			expectMINT:  true,
			expectADMIN: true,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			// Act (of AAA)
			p := GetContextPrincipal(tc.ctx)

			// Assert (of AAA)
			assert.Equal(t, tc.expectID, p.ID(), "ID")
			assert.Equal(t, tc.expectMINT, p.AllowMINT(), "MINT")
			assert.Equal(t, tc.expectADMIN, p.AllowADMIN(), "ADMIN")
		})
	}
}
