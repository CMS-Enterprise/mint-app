package oktaapi

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/okta/okta-sdk-golang/v2/okta"
	"github.com/okta/okta-sdk-golang/v2/okta/query"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// Client is a wrapper around github.com/okta/okta-sdk-golang/v2/okta Client type.
// The purpose of this package is to act as a drop-in replacement for the CEDAR LDAP API, so this package should implement the same
// methods that the Client interface defines in ./client.go
type clientWrapper struct {
	oktaClient *okta.Client
	logger     *zap.Logger
}

// NewClient creates a Client
func NewClient(logger *zap.Logger, url string, token string) (Client, error) {
	// TODO Do we need the "Context" response from okta.NewClient??
	_, oktaClient, oktaClientErr := okta.NewClient(context.TODO(), okta.WithOrgUrl(url), okta.WithToken(token))
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}
	return &clientWrapper{
		oktaClient: oktaClient,
		logger:     logger,
	}, nil
}

// oktaUserResponse is used to marshal the JSON response from Okta into a struct
type oktaUserResponse struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	Login       string `json:"login"`
}

func (cw *clientWrapper) parseOktaProfileResponse(profile *okta.UserProfile) (*models.UserInfo, error) {
	// Create an okaUserProfile to return
	parsedProfile := &oktaUserResponse{}

	// Marshal the profile into a string so we can later unmarshal it into a struct
	responseString, err := json.Marshal(profile)
	if err != nil {
		cw.logger.Error("error marshalling okta response", zap.Error(err))
		return nil, err
	}

	// Unmarshal the string into the oktaUserProfile type
	err = json.Unmarshal(responseString, parsedProfile)
	if err != nil {
		cw.logger.Error("error unmarshalling okta response", zap.Error(err))
		return nil, err
	}

	returnInfo := &models.UserInfo{
		DisplayName: parsedProfile.DisplayName,
		Email:       parsedProfile.Email,
		Username:    parsedProfile.Login,
		FirstName:   parsedProfile.FirstName,
		LastName:    parsedProfile.LastName,
	}

	return returnInfo, nil
}

func (cw *clientWrapper) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	user, _, err := cw.oktaClient.User.GetUser(ctx, username)
	if err != nil {
		cw.logger.Error("Error fetching Okta user", zap.Error(err), zap.String("username", username))
		return nil, err
	}

	profile, err := cw.parseOktaProfileResponse(user.Profile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func (cw *clientWrapper) SearchByName(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	// profile.SourceType can be EUA, EUA-AD, or cmsidm
	// the first 2 represent EUA users, the latter represents users created directly in IDM
	// status eq "ACTIVE" or status eq "STAGED" ensures we only get users who have EUAs (Staged means they just haven't logged in yet)
	// TODO: Searching on MAC users might be something like profile.cmsRolesArray eq "mint-medicare-admin-contractor"
	// TODO: If we need to search on MAC users, validate that this works even if the user has OTHER IDM roles (not _just_ this one)
	searchString := fmt.Sprintf(`(profile.SourceType eq "EUA" or profile.SourceType eq "EUA-AD") and (status eq "ACTIVE" or status eq "STAGED") and (profile.firstName sw "%v" or profile.lastName sw "%v" or profile.displayName sw "%v")`, searchTerm, searchTerm, searchTerm)
	search := query.NewQueryParams(query.WithSearch(searchString))

	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)
	if err != nil {
		cw.logger.Error("Error searching Okta users", zap.Error(err), zap.String("searchTerm", searchTerm))
		return nil, err
	}

	users := make([]*models.UserInfo, len(searchedUsers))
	for idx, user := range searchedUsers {
		profile, err := cw.parseOktaProfileResponse(user.Profile)
		if err != nil {
			return nil, err
		}
		users[idx] = profile
	}
	return users, nil
}
