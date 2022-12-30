package userhelpers

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OktaAccountInfo represents the information you get if you query an account from Okta
type OktaAccountInfo struct {
	Name              string `json:"name"`
	Locale            string `json:"locale"`
	Email             string `json:"email"`
	PreferredUsername string `json:"preferred_username"`
	GivenName         string `json:"given_name"`
	FamilyName        string `json:"family_name"`
	ZoneInfo          string `json:"zoneinfo"`
}

// GetOrCreateUserAccount will return an account if it exists, or create and return a new one if not
func GetOrCreateUserAccount(ctx context.Context, store *storage.Store, username string, hasLoggedIn bool,
	isMacUser bool, getAccountInformation func(ctx context.Context, username string) (*OktaAccountInfo, error)) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByUsername(username)
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	if userAccount != nil && userAccount.HasLoggedIn {
		return userAccount, nil
	}
	accountInfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	if userAccount == nil {
		userAccount = &authentication.UserAccount{}
	}
	userAccount.Username = &username
	userAccount.IsEUAID = !isMacUser
	userAccount.CommonName = accountInfo.Name
	userAccount.Locale = accountInfo.Locale
	userAccount.Email = accountInfo.Email
	userAccount.GivenName = accountInfo.GivenName
	userAccount.FamilyName = accountInfo.FamilyName
	userAccount.ZoneInfo = accountInfo.ZoneInfo
	userAccount.HasLoggedIn = hasLoggedIn

	if userAccount.ID == uuid.Nil {
		newAccount, newErr := store.UserAccountInsertByUsername(userAccount)
		if newErr != nil {
			return nil, newErr
		}
		return newAccount, nil
	}

	updatedAccount, updateErr := store.UserAccountUpdateByUserName(userAccount)
	if updateErr != nil {
		return nil, updateErr
	}
	return updatedAccount, nil
}

// GetAccountInformationWrapperFunction returns a function that returns *OktaAccountInfo with the input of a function that returns UserInfo
func GetAccountInformationWrapperFunction(getAccountInformation func(ctx context.Context, username string) (*models.UserInfo, error)) func(ctx context.Context, username string) (*OktaAccountInfo, error) {

	wrapperFunc := func(ctx context.Context, username string) (*OktaAccountInfo, error) {
		return GetAccountInformationWrapper(ctx, username, getAccountInformation)
	}
	return wrapperFunc
}

// GetAccountInformationWrapper this funtion appends models.UserInfo with needed account info fields as UNKNOWN
func GetAccountInformationWrapper(ctx context.Context, username string, getAccountInformation func(context.Context, string) (*models.UserInfo, error)) (*OktaAccountInfo, error) {
	userinfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo := &OktaAccountInfo{}
	accountInfo.Name = userinfo.CommonName
	accountInfo.Locale = "UNKNOWN"
	accountInfo.Email = userinfo.Email.String()
	accountInfo.PreferredUsername = userinfo.EuaUserID
	accountInfo.GivenName = userinfo.FirstName
	accountInfo.FamilyName = userinfo.LastName
	accountInfo.ZoneInfo = "UNKNOWN"

	return accountInfo, nil
}

// GetUserInfoFromOkta uses the Okta endpoint to retun OktaAccountInfo
func GetUserInfoFromOkta(ctx context.Context, username string) (*OktaAccountInfo, error) {
	userEndpoint := "/v1/userinfo" //TODO: it would be better to actually get the endpoint from the token, but not currently given to the front end
	authPrefix := "Bearer "
	enhancedJWT := appcontext.EnhancedJWT(ctx)
	oktaBaseURL, err := enhancedJWT.GetOktaBaseURL()
	if err != nil {
		return nil, err
	}
	url := *oktaBaseURL + userEndpoint
	authorization := authPrefix + enhancedJWT.AuthToken
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("content-type", "application/json")
	req.Header.Set("Authorization", authorization)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	jsonDataFromHTTP, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	ret := OktaAccountInfo{}
	err = json.Unmarshal([]byte(jsonDataFromHTTP), &ret)
	return &ret, err
}

// GetUserInfoFromOktaLocal is used to simulate okta user information when testing locally
func GetUserInfoFromOktaLocal(ctx context.Context, username string) (*OktaAccountInfo, error) {

	accountInfo := &OktaAccountInfo{
		Name:              username + " Doe",
		Locale:            "en_US",
		Email:             username + "@local.cms.gov",
		PreferredUsername: username,
		GivenName:         username,
		FamilyName:        "Doe",
		ZoneInfo:          "America/Los_Angeles",
	}
	return accountInfo, nil

}
