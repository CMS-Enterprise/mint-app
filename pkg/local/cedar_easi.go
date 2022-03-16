package local

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/appcontext"

	"go.uber.org/zap"
)

// NewCedarEasiClient returns a fake CEDAR Easi Client
func NewCedarEasiClient() *CedarEasiClient {
	return &CedarEasiClient{}
}

// CedarEasiClient mocks the CEDAR Easi client for local/test use
type CedarEasiClient struct{}

// CheckConnection tries to verify if we are able to communicate with the CEDAR API
func (c *CedarEasiClient) CheckConnection(context.Context) error {
	return nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c *CedarEasiClient) ValidateAndSubmitSystemIntake(ctx context.Context) (string, error) {
	fakeAlfabetID := "000-000-0"
	appcontext.ZLogger(ctx).Info("Mock Submit System Intake to CEDAR",
		zap.String("AlfabetID", fakeAlfabetID))
	return fakeAlfabetID, nil
}
