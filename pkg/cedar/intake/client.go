// Package intake serves as an Anti-Corruption Layer (in Domain Driven Design
// parlance), keeping the implementation details of working with the
// downstream CEDAR Intake API well separated, so the rest of the internal
// workings of the EASi code are not using anything defined by the
// external API
package intake

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	apiclient "github.com/cmsgov/mint-app/pkg/cedar/intake/gen/client"
	"github.com/cmsgov/mint-app/pkg/cedar/intake/gen/client/health_check"
	"github.com/cmsgov/mint-app/pkg/flags"
)

const (
	emitFlagKey = "emit-to-cedar"
	emitDefault = false
)

// NewClient builds the type that holds a connection to the CEDAR Intake API
func NewClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
	fnEmit := func(ctx context.Context) bool {
		// this is the conditional way of stopping us from submitting to CEDAR; see EASI-1025
		lduser := flags.Principal(ctx)
		result, err := ldClient.BoolVariation(emitFlagKey, lduser, emitDefault)
		if err != nil {
			appcontext.ZLogger(ctx).Info(
				"problem evaluating feature flag",
				zap.Error(err),
				zap.String("flagName", emitFlagKey),
				zap.Bool("flagDefault", emitDefault),
				zap.Bool("flagResult", result),
			)
		}
		return result
	}

	hc := http.DefaultClient

	return &Client{
		emitToCedar: fnEmit,
		auth: httptransport.APIKeyAuth(
			"x-Gateway-APIKey",
			"header",
			cedarAPIKey,
		),
		sdk: apiclient.New(
			httptransport.New(
				cedarHost,
				apiclient.DefaultBasePath,
				apiclient.DefaultSchemes,
			),
			strfmt.Default,
		),
		hc: hc,
	}
}

// Client represents a connection to the CEDAR Intake API
type Client struct {
	emitToCedar func(context.Context) bool
	auth        runtime.ClientAuthInfoWriter
	sdk         *apiclient.CEDARIntake
	hc          *http.Client
}

// CheckConnection hits the CEDAR Intake API `/healthcheck` endpoint to verify
// that our connection is functional
func (c *Client) CheckConnection(ctx context.Context) error {
	if !c.emitToCedar(ctx) {
		return nil
	}

	params := health_check.NewHealthCheckParamsWithContext(ctx)
	params.HTTPClient = c.hc

	resp, err := c.sdk.HealthCheck.HealthCheck(params, c.auth)
	if err != nil {
		return err
	}
	if resp.Payload == nil {
		return fmt.Errorf("no response body received")
	}
	return nil
}
