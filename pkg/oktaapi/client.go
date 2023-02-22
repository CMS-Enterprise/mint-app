package oktaapi

import (
	"context"

	"github.com/okta/okta-sdk-golang/v2/okta"
)

// Client is a wrapper around github.com/okta/okta-sdk-golang/v2/okta Client type.
// The purpose of this package is to act as a drop-in replacement for the CEDAR LDAP API, so this package should implement the same
// methods that the Client interface defines in pkg/cedar/cedarldap/translated_client.go
type Client struct {
	oktaClient *okta.Client
}

// NewClient creates a Client
func NewClient(url string, token string) (*Client, error) {
	// TODO Do we need the "Context" response from okta.NewClient??
	_, oktaClient, oktaClientErr := okta.NewClient(context.TODO(), okta.WithOrgUrl(url), okta.WithToken(token))
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}
	return &Client{
		oktaClient: oktaClient,
	}, nil
}

// func (o *Client) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
// 	o.oktaClient.
// }
