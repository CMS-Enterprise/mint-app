package resolvers

import (
	"github.com/launchdarkly/go-sdk-common/v3/ldcontext"
	ldclient "github.com/launchdarkly/go-server-sdk/v6"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// GetLDBool fetches a boolean flag from LD
func GetLDBool(principal authentication.Principal, ldClient *ldclient.LDClient, key string, defaultValue bool) (bool, error) {

	ldContext := ldcontext.
		NewBuilder(principal.ID()).
		Anonymous(defaultValue).
		Build()

	boolVal, err := ldClient.BoolVariation(key, ldContext, false)
	if err != nil {
		return defaultValue, err
	}
	return boolVal, nil

}
