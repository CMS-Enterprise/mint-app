package main

import (
	"context"
	"strings"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// PossibleUser represents user information for backfill purposes
type PossibleUser struct {
	Name         string
	Email        string
	Aliases      string
	EUAID        string
	Role         string
	Organization string
	GivenName    string
	FamilyName   string
}

// PossibleUserDictionary is a mapping of possible users by Name
type PossibleUserDictionary map[string]*PossibleUser

// NewPossibleUserDictionary converts an array of Possible Users to a Dictionary
func NewPossibleUserDictionary(possibleUsers []PossibleUser) *PossibleUserDictionary {
	PossibleUserD := PossibleUserDictionary{}
	for i := 0; i < len(possibleUsers); i++ {
		PossibleUserD[possibleUsers[i].Name] = &possibleUsers[i]
	}
	return &PossibleUserD
}

func (pd PossibleUserDictionary) tryGetUserByName(userName string) *PossibleUser {

	user := pd[userName]
	// dictionary := pd.(map[string])

	if user == nil {

		//Search function to get user by alias
		// lo.Find[PossibleUser](pd,func(i string) bool{

		// })

		// userKey, found := lo.FindKeyBy[string, *PossibleUser](pd, func(i string, user *PossibleUser) bool {
		userKey, found := lo.FindKeyBy(pd, func(i string, user *PossibleUser) bool {
			return strings.Contains(user.Aliases, userName)
		})
		if found {
			user = pd[userKey]
		}

	}
	return user

}

func backfillUserWrapperAccountInfoFunc(ctx context.Context, username string, user *PossibleUser) userhelpers.GetAccountInfoFunc {
	wrapper := func(ctx context.Context, username string) (*userhelpers.AccountInfo, error) {
		account := userhelpers.AccountInfo{
			Name:              user.Name,
			Locale:            "UNKNOWN",
			Email:             user.Email,
			PreferredUsername: user.EUAID,
			GivenName:         user.GivenName,
			FamilyName:        user.FamilyName,
			ZoneInfo:          "UNKNOWN",
		}
		return &account, nil

	}
	return wrapper
}
