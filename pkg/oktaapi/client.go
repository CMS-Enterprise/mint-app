package oktaapi

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/okta/okta-sdk-golang/v2/okta"
	"github.com/okta/okta-sdk-golang/v2/okta/query"

	"github.com/cmsgov/mint-app/pkg/models"
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

type oktaUserProfile struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	Login       string `json:"login"`
}

func parseOktaProfileResponse(profile *okta.UserProfile) (*models.UserInfo, error) {
	// Create an okaUserProfile to return
	parsedProfile := &oktaUserProfile{}

	// Marshal the profile into a string so we can later unmarshal it into a struct
	responseString, err := json.Marshal(profile)
	if err != nil {
		return nil, err
	}

	// Unmarshal the string into the oktaUserProfile type
	json.Unmarshal(responseString, parsedProfile)

	returnInfo := &models.UserInfo{
		CommonName: parsedProfile.DisplayName,
		Email:      models.EmailAddress(parsedProfile.Email),
		EuaUserID:  parsedProfile.Login,
		FirstName:  parsedProfile.FirstName,
		LastName:   parsedProfile.LastName,
	}

	return returnInfo, nil
}

func (o *Client) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	user, _, err := o.oktaClient.User.GetUser(ctx, username)
	if err != nil {
		return nil, err
	}

	profile, err := parseOktaProfileResponse(user.Profile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func (o *Client) SearchCommonNameContains(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	filterString := fmt.Sprintf(`profile.firstName eq "%v"`, searchTerm)
	filter := query.NewQueryParams(query.WithFilter(filterString))

	filteredUsers, _, err := o.oktaClient.User.ListUsers(ctx, filter)
	if err != nil {
		fmt.Printf("Error Getting Users: %v\n", err)
	}

	users := make([]*models.UserInfo, len(filteredUsers))
	for idx, user := range filteredUsers {
		profile, err := parseOktaProfileResponse(user.Profile)
		if err != nil {
			return nil, err
		}
		users[idx] = profile
	}
	return users, nil
}
