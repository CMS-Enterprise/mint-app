package local

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"

	"go.uber.org/zap"
)

// NewCedarMINTClient returns a fake CEDAR MINT Client
func NewCedarMINTClient() *CedarMINTClient {
	return &CedarMINTClient{}
}

// CedarMINTClient mocks the CEDAR MINT client for local/test use
type CedarMINTClient struct{}

// CheckConnection tries to verify if we are able to communicate with the CEDAR API
func (c *CedarMINTClient) CheckConnection(context.Context) error {
	return nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c *CedarMINTClient) ValidateAndSubmitSystemIntake(ctx context.Context) (string, error) {
	fakeAlfabetID := "000-000-0"
	appcontext.ZLogger(ctx).Info("Mock Submit System Intake to CEDAR",
		zap.String("AlfabetID", fakeAlfabetID))
	return fakeAlfabetID, nil
}
