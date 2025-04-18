package models

import (
	"fmt"
	"strings"

	"github.com/samber/lo"
)

// MTOCommonSolutionContactInformation is a wrapper method that enables efficient fetching and sortinf of MTOCommonSolutionContact information
type MTOCommonSolutionContactInformation struct {
	PointsOfContact []*MTOCommonSolutionContact `json:"pointsOfContact"`
}

func (mtoCSC *MTOCommonSolutionContactInformation) PrimaryContact() (*MTOCommonSolutionContact, error) {
	if mtoCSC == nil {
		return nil, fmt.Errorf("contact information is not populated as expected")
	}
	if len(mtoCSC.PointsOfContact) < 1 {
		return nil, fmt.Errorf("points of contact are not listed for this solution")
	}
	contact, found := lo.Find(mtoCSC.PointsOfContact, func(contact *MTOCommonSolutionContact) bool {
		return contact.IsPrimary
	})
	if !found {
		return nil, fmt.Errorf("there was no primary contact found for this point of contact")
	}
	return contact, nil

}

func (mtoCSC *MTOCommonSolutionContactInformation) EmailAddresses(sendToTaggedPOCs bool, devTeamEmail string) ([]string, error) {
	var pocEmailAddress []string
	if mtoCSC == nil {
		return nil, fmt.Errorf("contact information is not populated as expected")
	}
	pocs := mtoCSC.PointsOfContact
	if sendToTaggedPOCs { //send to the pocs
		pocEmailAddress = lo.Map(pocs, func(poc *MTOCommonSolutionContact, _ int) string {
			return poc.Email
		})
	} else {
		devEmailusername, devEmailDomain, emailValid := strings.Cut(devTeamEmail, "@")
		if !emailValid {
			return nil, fmt.Errorf("dev team email format is invalid, unable to send mock solution POC emails. Expected email to only have @ symbol, email :%s", devTeamEmail)
		}
		pocEmailAddress = lo.Map(pocs, func(poc *MTOCommonSolutionContact, _ int) string {
			// this takes advantage of the fact that you can append extra information after the + sign to send to an email address with extra info.
			noSpaceName := strings.ReplaceAll(poc.Name, " ", "")
			return devEmailusername + "+" + noSpaceName + "@" + devEmailDomain
		})

	}
	return pocEmailAddress, nil
}

type MTOCommonSolutionContact struct {
	baseStruct
	Key       MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
	Name      string               `db:"name" json:"name"`
	Email     string               `db:"email" json:"email"`
	IsTeam    bool                 `db:"is_team" json:"isTeam"`
	Role      *string              `db:"role" json:"role"`
	IsPrimary bool                 `db:"is_primary" json:"isPrimary"`
}
