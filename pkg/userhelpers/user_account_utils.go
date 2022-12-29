package userhelpers

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

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
func GetOrCreateUserAccount(ctx context.Context, store *storage.Store, username string, useLocal bool, isMacUser bool) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByUsername(username)
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	if userAccount != nil {
		return userAccount, nil
	}
	accountInfo := &OktaAccountInfo{}
	if useLocal {
		accountInfo.Name = username + " Doe"
		accountInfo.Locale = "en_US"
		accountInfo.Email = username + "@local.cms.gov"
		accountInfo.PreferredUsername = username
		accountInfo.GivenName = username
		accountInfo.FamilyName = "Doe"
		accountInfo.ZoneInfo = "America/Los_Angeles"
	} else {
		// oktaInfo, err := GetUserInfoFromOkta(baseURL, token)
		oktaInfo, err := GetUserInfoFromOkta(ctx)
		if err != nil {
			return nil, err
		}
		accountInfo = oktaInfo
	}

	if userAccount == nil {
		user := authentication.UserAccount{
			Username:    &username,
			IsEUAID:     !isMacUser,
			CommonName:  accountInfo.Name,
			Locale:      accountInfo.Locale,
			Email:       accountInfo.Email,
			GivenName:   accountInfo.GivenName,
			FamilyName:  accountInfo.FamilyName,
			ZoneInfo:    accountInfo.ZoneInfo,
			HasLoggedIn: true,
		}
		newAccount, err := store.UserAccountInsertByUsername(&user)
		if err != nil {
			return nil, err
		}
		userAccount = newAccount
	}
	return userAccount, nil
}

// GetOrCreateUserAccountDelegate will return an account if it exists, or create and return a new one if not, getting information from delegate function
func GetOrCreateUserAccountDelegate(ctx context.Context, store *storage.Store, username string, getAccountInformation func(context.Context, string) (*models.UserInfo, error)) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByUsername(username)
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	if userAccount != nil {
		return userAccount, nil
	}
	accountInfo := &OktaAccountInfo{}

	userinfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo.Name = userinfo.CommonName
	accountInfo.Locale = "UNKNOWN"
	accountInfo.Email = userinfo.Email.String()
	accountInfo.PreferredUsername = userinfo.EuaUserID
	accountInfo.GivenName = userinfo.FirstName
	accountInfo.FamilyName = userinfo.LastName
	accountInfo.ZoneInfo = "UNKNOWN"

	if userAccount == nil {
		user := authentication.UserAccount{
			Username:    &username,
			IsEUAID:     true, //TODO verify this
			CommonName:  accountInfo.Name,
			Locale:      accountInfo.Locale,
			Email:       accountInfo.Email,
			GivenName:   accountInfo.GivenName,
			FamilyName:  accountInfo.FamilyName,
			ZoneInfo:    accountInfo.ZoneInfo,
			HasLoggedIn: false, //TODO, need to verify this,
		}
		newAccount, err := store.UserAccountInsertByUsername(&user)
		if err != nil {
			return nil, err
		}
		userAccount = newAccount
	}
	return userAccount, nil
}

// GetUserInfoFromOkta uses the Okta endpoint to retun OktaAccountInfo
func GetUserInfoFromOkta(ctx context.Context) (*OktaAccountInfo, error) {
	userEndpoint := "/v1/userinfo" //TODO: it would be better to actually get the endpoint from the token, but not currently given to the front end
	authPrefix := "Bearer "
	enhancedJWT := appcontext.JWT(ctx)
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
