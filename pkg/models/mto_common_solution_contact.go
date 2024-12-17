package models

import (
	"fmt"

	"github.com/samber/lo"
)

// MTOCommonSolutionContactInformation is a wrapper method that enables efficient fetching and sortinf of MTOCommonSolutionContact information
type MTOCommonSolutionContactInformation struct {
	PointsOfContact []*MTOCommonSolutionContact `json:"pointsOfContact"`
}

func (mtoCSC *MTOCommonSolutionContactInformation) PrimaryContact() (*MTOCommonSolutionContact, error) {
	if mtoCSC == nil {
		return nil, fmt.Errorf("contact information is not populatied as expected")
	}
	if len(mtoCSC.PointsOfContact) < 1 {
		return nil, fmt.Errorf("points of contact are not listed for the  is not populatied as expected")
	}
	contact, found := lo.Find(mtoCSC.PointsOfContact, func(contact *MTOCommonSolutionContact) bool {
		return contact.IsPrimary
	})
	if !found {
		return nil, fmt.Errorf("there was no primary contact found for this point of contact")
	}
	return contact, nil

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
