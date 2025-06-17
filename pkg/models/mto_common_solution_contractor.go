package models

import (
	"fmt"

	"github.com/google/uuid"
)

// MTOCommonSolutionContractorInformation is a wrapper method that enables efficient fetching and sortinf of MTOCommonSolutionContact information
type MTOCommonSolutionContractorInformation struct {
	Contractors []*MTOCommonSolutionContractor `json:"contractors"`
}

func (mtoCSCI *MTOCommonSolutionContractorInformation) ContractorsList() ([]*MTOCommonSolutionContractor, error) {
	if mtoCSCI == nil {
		return nil, fmt.Errorf("contractor information is not populated as expected")
	}
	return mtoCSCI.Contractors, nil
}

type MTOCommonSolutionContractor struct {
	baseStruct
	Key             MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
	ContractorTitle *string              `db:"contractor_title" json:"contractorTitle"`
	ContractorName  string               `db:"contractor_name" json:"contractorName"`
}

// NewMTOCommonSolutionContractor returns a new MTOCommonSolutionContractor object
func NewMTOCommonSolutionContractor(
	createdBy uuid.UUID,
	key MTOCommonSolutionKey,
	contractorTitle *string,
	contractorName string,
) *MTOCommonSolutionContractor {
	return &MTOCommonSolutionContractor{
		baseStruct:      NewBaseStruct(createdBy),
		Key:             key,
		ContractorTitle: contractorTitle,
		ContractorName:  contractorName,
	}
}
