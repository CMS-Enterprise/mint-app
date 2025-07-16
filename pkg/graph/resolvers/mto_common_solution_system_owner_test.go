package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestCreateMTOCommonSolutionSystemOwner validates creating a system owner for a common solution.
func (suite *ResolverSuite) TestCreateMTOCommonSolutionSystemOwner() {
	changes := map[string]interface{}{
		"ownerType":    "BUSINESS_OWNER",
		"cmsComponent": "OFFICE_OF_LEGISLATION",
	}

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		changes,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)
	suite.Equal(models.MTOCSKInnovation, systemOwner.Key)
	suite.Equal(changes["ownerType"], string(systemOwner.OwnerType))
	suite.Equal(changes["cmsComponent"], string(systemOwner.CMSComponent))
}

// TestUpdateMTOCommonSolutionSystemOwner validates updating a system owner for a common solution.
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionSystemOwner() {
	// Create a system owner to update
	changes := map[string]interface{}{
		"ownerType":    "BUSINESS_OWNER",
		"cmsComponent": "OFFICE_OF_LEGISLATION",
	}

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		changes,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)

	// Update the system owner
	updatedChanges := map[string]interface{}{
		"ownerType":    "BUSINESS_OWNER",
		"cmsComponent": "CENTER_FOR_MEDICARE_CM",
	}
	updatedSystemOwner, err := UpdateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		systemOwner.ID,
		updatedChanges,
	)
	suite.NoError(err)
	suite.NotNil(updatedSystemOwner)
	suite.Equal(updatedChanges["ownerType"], string(updatedSystemOwner.OwnerType))
	suite.Equal(updatedChanges["cmsComponent"], string(updatedSystemOwner.CMSComponent))
}

// TestGetMTOCommonSolutionSystemOwner validates retrieving a system owner for a common solution by ID.
func (suite *ResolverSuite) TestGetMTOCommonSolutionSystemOwner() {
	// Create a system owner to retrieve
	changes := map[string]interface{}{
		"ownerType":    "BUSINESS_OWNER",
		"cmsComponent": "OFFICE_OF_LEGISLATION",
	}

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		changes,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)

	// Retrieve the system owner
	fetchedSystemOwner, err := GetMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		systemOwner.ID,
	)
	suite.NoError(err)
	suite.NotNil(fetchedSystemOwner)
	suite.Equal(systemOwner.ID, fetchedSystemOwner.ID)
	suite.Equal(systemOwner.Key, fetchedSystemOwner.Key)
	suite.Equal(systemOwner.OwnerType, fetchedSystemOwner.OwnerType)
	suite.Equal(systemOwner.CMSComponent, fetchedSystemOwner.CMSComponent)
}

// TestDeleteMTOCommonSolutionSystemOwner validates deleting a system owner for a common solution.
func (suite *ResolverSuite) TestDeleteMTOCommonSolutionSystemOwner() {
	// Create a system owner to delete
	changes := map[string]interface{}{
		"ownerType":    "BUSINESS_OWNER",
		"cmsComponent": "OFFICE_OF_LEGISLATION",
	}

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		changes,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)

	// Delete the system owner
	deletedSystemOwner, err := DeleteMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		systemOwner.ID,
	)
	suite.NoError(err)
	suite.NotNil(deletedSystemOwner)
	suite.Equal(systemOwner.ID, deletedSystemOwner.ID)
}
