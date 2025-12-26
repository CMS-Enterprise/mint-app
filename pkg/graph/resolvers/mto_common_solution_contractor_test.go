package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestCreateMTOCommonSolutionContractor validates creating a contractor for a common solution.
func (suite *ResolverSuite) TestCreateMTOCommonSolutionContractor() {
	contractorName := "Acme Health Solutions"
	contractTitle := "Primary Contractor"
	key := models.MTOCSKInnovation

	contractor, err := CreateMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		key,
		&contractTitle,
		contractorName,
	)
	suite.NoError(err)
	suite.NotNil(contractor)
	suite.Equal(contractorName, contractor.ContractorName)
	suite.Equal(contractTitle, *contractor.ContractTitle)
	suite.Equal(key, contractor.Key)
}

// TestUpdateMTOCommonSolutionContractor validates updating a contractor for a common solution.
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionContractor() {
	// Create a contractor to update
	contractorName := "Acme Health Solutions"
	contractTitle := "Primary Contractor"
	key := models.MTOCSKInnovation

	contractor, err := CreateMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		key,
		&contractTitle,
		contractorName,
	)
	suite.NoError(err)
	suite.NotNil(contractor)

	// Update the contractor
	updatedTitle := "Updated Contractor Title"
	updatedName := "Updated Contractor Name"
	updatedContractor, err := UpdateMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		contractor.ID,
		map[string]interface{}{
			"contractTitle":  updatedTitle,
			"contractorName": updatedName,
		},
	)
	suite.NoError(err)
	suite.NotNil(updatedContractor)
	suite.Equal(updatedTitle, *updatedContractor.ContractTitle)
	suite.Equal(updatedName, updatedContractor.ContractorName)
}

// TestGetMTOCommonSolutionContractor validates retrieving a contractor for a common solution by ID.
func (suite *ResolverSuite) TestGetMTOCommonSolutionContractor() {
	// Create a contractor to retrieve
	contractorName := "Acme Health Solutions"
	contractTitle := "Primary Contractor"
	key := models.MTOCSKInnovation

	contractor, err := CreateMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		key,
		&contractTitle,
		contractorName,
	)
	suite.NoError(err)
	suite.NotNil(contractor)

	// Retrieve the contractor
	fetchedContractor, err := GetMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contractor.ID,
	)
	suite.NoError(err)
	suite.NotNil(fetchedContractor)
	suite.Equal(contractor.ID, fetchedContractor.ID)
	suite.Equal(contractorName, fetchedContractor.ContractorName)
	suite.Equal(contractTitle, *fetchedContractor.ContractTitle)
}

// TestDeleteMTOCommonSolutionContractor validates deleting a contractor for a common solution.
func (suite *ResolverSuite) TestDeleteMTOCommonSolutionContractor() {
	// Create a contractor to delete
	contractorName := "Acme Health Solutions"
	contractTitle := "Primary Contractor"
	key := models.MTOCSKInnovation

	contractor, err := CreateMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		key,
		&contractTitle,
		contractorName,
	)
	suite.NoError(err)
	suite.NotNil(contractor)

	// Delete the contractor
	deletedContractor, err := DeleteMTOCommonSolutionContractor(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		contractor.ID,
	)
	suite.NoError(err)
	suite.NotNil(deletedContractor)
	suite.Equal(contractor.ID, deletedContractor.ID)
}
