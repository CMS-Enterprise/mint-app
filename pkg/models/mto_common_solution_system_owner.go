package models

import (
	"fmt"

	"github.com/google/uuid"
)

// MTOCommonSolutionOwnerType is an enum that represents the types of owners for MTOCommonSolutionSystemOwner
type MTOCommonSolutionOwnerType string

// These constants represent the different values of MTOCommonSolutionOwnerType
const (
	SystemOwner   MTOCommonSolutionOwnerType = "SYSTEM_OWNER"
	BusinessOwner MTOCommonSolutionOwnerType = "BUSINESS_OWNER"
)

// MTOCommonSolutionSystemOwnerInformation is a wrapper method that enables efficient fetching and sorting of MTOCommonSolutionSystemOwner information
type MTOCommonSolutionSystemOwnerInformation struct {
	SystemOwners []*MTOCommonSolutionSystemOwner `json:"systemOwners"`
}

func (mtoCSSOI *MTOCommonSolutionSystemOwnerInformation) SystemOwnersList() ([]*MTOCommonSolutionSystemOwner, error) {
	if mtoCSSOI == nil {
		return nil, fmt.Errorf("system owner information is not populated as expected")
	}
	return mtoCSSOI.SystemOwners, nil
}

type MTOCommonSolutionSystemOwner struct {
	baseStruct
	Key          MTOCommonSolutionKey       `json:"key" db:"mto_common_solution_key"`
	OwnerType    MTOCommonSolutionOwnerType `db:"owner_type" json:"ownerType"`
	CMSComponent string                     `db:"cms_component" json:"cmsComponent"`
}

// NewMTOCommonSolutionSystemOwner returns a new MTOCommonSolutionSystemOwner object
func NewMTOCommonSolutionSystemOwner(
	createdBy uuid.UUID,
	key MTOCommonSolutionKey,
	ownerType MTOCommonSolutionOwnerType,
	cmsComponent string,
) *MTOCommonSolutionSystemOwner {
	return &MTOCommonSolutionSystemOwner{
		baseStruct:   NewBaseStruct(createdBy),
		Key:          key,
		OwnerType:    ownerType,
		CMSComponent: cmsComponent,
	}
}
