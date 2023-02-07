package oktaapi

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/okta/okta-sdk-golang/v2/okta"
)

type OktaApiClientWrapper struct {
	oktaClient *okta.Client
}

func NewOktaApiClientWrapper(url string, token string) (*OktaApiClientWrapper, error) {
	// TODO Do we need the "Context" response from okta.NewClient??
	_, oktaClient, oktaClientErr := okta.NewClient(context.TODO(), okta.WithOrgUrl(url), okta.WithToken(token))
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}
	return &OktaApiClientWrapper{
		oktaClient: oktaClient,
	}, nil
}

func (o *OktaApiClientWrapper) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	o.oktaClient.
}
