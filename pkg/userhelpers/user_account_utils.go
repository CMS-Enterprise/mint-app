package userhelpers

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// OktaAccountInfo represents the information you get if you query an account from Okta
// TODO Replace this with calls to the Okta API so we can use the same information we use in other places in the application
type OktaAccountInfo struct {
	Name              string `json:"name"`
	Locale            string `json:"locale"`
	Email             string `json:"email"`
	PreferredUsername string `json:"preferred_username"`
	GivenName         string `json:"given_name"`
	FamilyName        string `json:"family_name"`
	ZoneInfo          string `json:"zoneinfo"`
}

// AccountInfo represents information needed to make a UserAccount, independent of the source of the information
type AccountInfo OktaAccountInfo

// GetAccountInfoFunc represents a type of function which takes a context and username and returns AccountInfo
type GetAccountInfoFunc func(ctx context.Context, username string) (*AccountInfo, error)

// GetOktaAccountInfoFunc represents a type of function which takes a context and username and returns OktaAccountInfo
type GetOktaAccountInfoFunc func(ctx context.Context, username string) (*OktaAccountInfo, error)

// GetUserInfoFunc represents a type of function which takes a context and username and returns UserInfo
type GetUserInfoFunc func(ctx context.Context, username string) (*models.UserInfo, error)

// GetOrCreateUserAccount will return an account if it exists, or create and return a new one if not
func GetOrCreateUserAccount(ctx context.Context, np sqlutils.NamedPreparer, txPreparer sqlutils.TransactionPreparer, username string, hasLoggedIn bool,
	isMacUser bool, getAccountInformation GetAccountInfoFunc) (*authentication.UserAccount, error) {
	userAccount, accErr := storage.UserAccountGetByUsername(np, username)
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
		// Future Enhancement: consider making this take just a tx, or expand the np to return a transaction if not a transaction
		createdAccount, err := createUserAccountAndPreferences(txPreparer, np, userAccount)
		if err != nil {
			return nil, err
		}
		return createdAccount, nil
	}

	updatedAccount, updateErr := storage.UserAccountUpdateByUserName(np, userAccount)
	if updateErr != nil {
		return nil, updateErr
	}
	return updatedAccount, nil
}

// createUserAccountAndPreferences creates a user account and preferences. If the np is not a SQL utils tx, it will wrap it in a TX
func createUserAccountAndPreferences(txPrep sqlutils.TransactionPreparer, np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {

	tx, isTX := np.(*sqlx.Tx)
	if isTX {
		return createUserAccountAndPreferencesTransaction(tx, userAccount)
	}
	createdAccount, err := sqlutils.WithTransaction[authentication.UserAccount](txPrep, func(tx *sqlx.Tx) (*authentication.UserAccount, error) {
		return createUserAccountAndPreferencesTransaction(tx, userAccount)
	})
	return createdAccount, err

}

// createUserAccountAndPreferencesTransaction is the internal transaction code needed to create all the components necessary for a user account
func createUserAccountAndPreferencesTransaction(tx *sqlx.Tx, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {
	newAccount, newErr := storage.UserAccountInsertByUsername(tx, userAccount)
	if newErr != nil {
		return nil, newErr
	}
	pref := models.NewUserNotificationPreferences(newAccount.ID)

	_, preferencesErr := storage.UserNotificationPreferencesCreate(tx, pref)
	if preferencesErr != nil {
		return nil, preferencesErr
	}
	return newAccount, nil
}

// GetUserInfoAccountInfoWrapperFunc returns a function that returns *AccountInfo with the input of a function that returns UserInfo
func GetUserInfoAccountInfoWrapperFunc(getUserInfo GetUserInfoFunc) GetAccountInfoFunc {

	wrapperFunc := func(ctx context.Context, username string) (*AccountInfo, error) {
		return GetUserInfoAccountInfoWrapper(ctx, username, getUserInfo)
	}
	return wrapperFunc
}

// GetUserInfoAccountInfoWrapper this function appends models.UserInfo with needed account info fields as UNKNOWN
func GetUserInfoAccountInfoWrapper(ctx context.Context, username string, getUserInfo GetUserInfoFunc) (*AccountInfo, error) {
	userinfo, err := getUserInfo(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo := &AccountInfo{}
	accountInfo.Name = userinfo.DisplayName
	accountInfo.Locale = "UNKNOWN"
	accountInfo.Email = userinfo.Email
	accountInfo.PreferredUsername = userinfo.Username
	accountInfo.GivenName = userinfo.FirstName
	accountInfo.FamilyName = userinfo.LastName
	accountInfo.ZoneInfo = "UNKNOWN"

	return accountInfo, nil
}

// GetOktaAccountInfoWrapperFunction returns a function that returns *AccountInfo with the input of a function that returns OktaAccountInfo
func GetOktaAccountInfoWrapperFunction(getAccountInformation GetOktaAccountInfoFunc) GetAccountInfoFunc {
	wrapperFunc := func(ctx context.Context, username string) (*AccountInfo, error) {
		return GetOktaAccountInfoWrapper(ctx, username, getAccountInformation)
	}
	return wrapperFunc
}

// GetOktaAccountInfoWrapper converts a returns OktaAccountInformation converted to AccountInformation
func GetOktaAccountInfoWrapper(ctx context.Context, username string, getAccountInformation GetOktaAccountInfoFunc) (*AccountInfo, error) {
	userinfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo := &AccountInfo{}
	accountInfo.Name = userinfo.Name
	accountInfo.Locale = userinfo.Locale
	accountInfo.Email = userinfo.Email
	accountInfo.PreferredUsername = userinfo.PreferredUsername
	accountInfo.GivenName = userinfo.GivenName
	accountInfo.FamilyName = userinfo.FamilyName
	accountInfo.ZoneInfo = userinfo.ZoneInfo

	return accountInfo, nil
}

// GetOktaAccountInfo uses the Okta endpoint to retun OktaAccountInfo
func GetOktaAccountInfo(ctx context.Context, _ string) (*OktaAccountInfo, error) {
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

// UserAccountGetByIDLOADER uses a data loader to return a user account from the database
func UserAccountGetByIDLOADER(ctx context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
	allLoaders := loaders.Loaders(ctx)
	userAccountLoader := allLoaders.UserAccountLoader

	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := userAccountLoader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.(*authentication.UserAccount), nil

}
