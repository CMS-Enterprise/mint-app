package models

import (
	"fmt"
	"strings"

	"github.com/samber/lo"
)

// PossibleOperationalSolutionContact represents a contact for a possible operational solution
type PossibleOperationalSolutionContact struct {
	baseStruct
	PossibleOperationalSolutionID int `db:"possible_operational_solution_id" json:"possibleOperationalSolutionID"`

	Name      string  `db:"name" json:"name"`
	Email     string  `db:"email" json:"email"`
	IsTeam    bool    `db:"isTeam" json:"is_team"`
	Role      *string `db:"role" json:"role"`
	IsPrimary bool    `db:"is_primary" json:"isPrimary"`
}

// GetPOCEmailAddresses transforms an array of POCs to return a list of email addresses.
// if sendToTaggedPOCs is false, the individual POC email addresses will be simulated and added to the devteamEmail
func GetPOCEmailAddresses(pocs []*PossibleOperationalSolutionContact, sendToTaggedPOCs bool, devTeamEmail string) ([]string, error) {
	var pocEmailAddress []string
	if sendToTaggedPOCs { //send to the pocs
		pocEmailAddress = lo.Map(pocs, func(poc *PossibleOperationalSolutionContact, _ int) string {
			return poc.Email
		})
	} else {
		devEmailusername, devEmailDomain, emailValid := strings.Cut(devTeamEmail, "@")
		if !emailValid {
			return nil, fmt.Errorf("dev team email format is invalid, unable to send mock solution POC emails. Expected email to only have @ symbol, email :%s", devTeamEmail)
		}
		pocEmailAddress = lo.Map(pocs, func(poc *PossibleOperationalSolutionContact, _ int) string {
			// this takes advantage of the fact that you can append extra information after the + sign to send to an email address with extra info.
			noSpaceName := strings.ReplaceAll(poc.Name, " ", "")
			return devEmailusername + "+" + noSpaceName + "@" + devEmailDomain
		})

	}
	return pocEmailAddress, nil
}
