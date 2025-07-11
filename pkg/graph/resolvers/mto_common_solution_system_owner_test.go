package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestCreateMTOCommonSolutionSystemOwner validates creating a system owner for a common solution.
func (suite *ResolverSuite) TestCreateMTOCommonSolutionSystemOwner() {
	key := models.MTOCSKInnovation
	ownerType := models.SystemOwner
	cmsComponent := "CMS Component Example"

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		key,
		ownerType,
		cmsComponent,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)
	suite.Equal(key, systemOwner.Key)
	suite.Equal(ownerType, systemOwner.OwnerType)
	suite.Equal(cmsComponent, systemOwner.CMSComponent)
}

// TestUpdateMTOCommonSolutionSystemOwner validates updating a system owner for a common solution.
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionSystemOwner() {
	// Create a system owner to update
	key := models.MTOCSKInnovation
	ownerType := models.SystemOwner
	cmsComponent := "CMS Component Example"

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		key,
		ownerType,
		cmsComponent,
	)
	suite.NoError(err)
	suite.NotNil(systemOwner)

	// Update the system owner
	updatedOwnerType := models.BusinessOwner
	updatedCMSComponent := "Updated CMS Component"
	updatedSystemOwner, err := UpdateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		systemOwner.ID,
		map[string]interface{}{
			"OwnerType":    updatedOwnerType,
			"CMSComponent": updatedCMSComponent,
		},
	)
	suite.NoError(err)
	suite.NotNil(updatedSystemOwner)
	suite.Equal(updatedOwnerType, updatedSystemOwner.OwnerType)
	suite.Equal(updatedCMSComponent, updatedSystemOwner.CMSComponent)
}

// TestGetMTOCommonSolutionSystemOwner validates retrieving a system owner for a common solution by ID.
func (suite *ResolverSuite) TestGetMTOCommonSolutionSystemOwner() {
	// Create a system owner to retrieve
	key := models.MTOCSKInnovation
	ownerType := models.SystemOwner
	cmsComponent := "CMS Component Example"

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		key,
		ownerType,
		cmsComponent,
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
	key := models.MTOCSKInnovation
	ownerType := models.SystemOwner
	cmsComponent := "CMS Component Example"

	systemOwner, err := CreateMTOCommonSolutionSystemOwner(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		key,
		ownerType,
		cmsComponent,
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
