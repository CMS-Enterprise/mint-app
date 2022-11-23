package userhelpers

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/cmsgov/mint-app/pkg/authentication"
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
func GetOrCreateUserAccount(store *storage.Store, username string, useLocal bool, baseURL string, token string, isMacUser bool) (*authentication.UserAccount, error) {
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
		oktaInfo, err := GetUserInfoFromOkta(baseURL, token)
		if err != nil {
			return nil, err
		}
		accountInfo = oktaInfo
	}

	if userAccount == nil {
		user := authentication.UserAccount{
			Username:   &username,
			IsEUAID:    !isMacUser,
			CommonName: accountInfo.Name,
			Locale:     accountInfo.Locale,
			Email:      accountInfo.Email,
			GivenName:  accountInfo.GivenName,
			FamilyName: accountInfo.FamilyName,
			ZoneInfo:   accountInfo.ZoneInfo,
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
func GetUserInfoFromOkta(baseURL string, token string) (*OktaAccountInfo, error) {
	userEndpoint := "/v1/userinfo" //TODO: it would be better to actually get the endpoint from the token, but not currently given to the front end
	authPrefix := "Bearer "

	url := baseURL + userEndpoint
	authorization := authPrefix + token
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
	err = json.Unmarshal([]byte(jsonDataFromHTTP), &ret) // TODO, add type safety, handle bad data

	//TODO deserialize to another struct. Do we want another

	return &ret, err
}
