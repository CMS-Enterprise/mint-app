package appcontext

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/shared/appcontext/constants"
	"github.com/google/uuid"
)

// GetContextTrace returns the context's trace UUID
// TODO: Isolate Trace logic
func GetContextTrace(ctx context.Context) (uuid.UUID, bool) {
	traceID, ok := ctx.Value(constants.TraceKey).(uuid.UUID)
	return traceID, ok
}

// GetContextPrincipal returns the security principal, defaulting to
// an Anonymous user if not assigned.
// TODO: Isolate Principal logic
func GetContextPrincipal(ctx context.Context) authentication.Principal {
	if principal, ok := ctx.Value(constants.PrincipalKey).(authentication.Principal); ok {
		return principal
	}
	return authentication.ANON
}
