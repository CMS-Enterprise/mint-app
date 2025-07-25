package models

import (
	"fmt"

	"github.com/google/uuid"
)

// MTOCommonSolutionContractorInformation is a wrapper method that enables efficient fetching and sorting of MTOCommonSolutionContact information
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
	Key            MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
	ContractTitle  *string              `db:"contract_title" json:"contractTitle"`
	ContractorName string               `db:"contractor_name" json:"contractorName"`
}

// NewMTOCommonSolutionContractor returns a new MTOCommonSolutionContractor object
func NewMTOCommonSolutionContractor(
	createdBy uuid.UUID,
	key MTOCommonSolutionKey,
	contractTitle *string,
	contractorName string,
) *MTOCommonSolutionContractor {
	return &MTOCommonSolutionContractor{
		baseStruct:     NewBaseStruct(createdBy),
		Key:            key,
		ContractTitle:  contractTitle,
		ContractorName: contractorName,
	}
}
