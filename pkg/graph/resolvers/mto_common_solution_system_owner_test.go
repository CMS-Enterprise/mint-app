package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestCreateMTOCommonSolutionSystemOwner validates creating a system owner for a common solution.
func (suite *ResolverSuite) TestCreateMTOCommonSolutionSystemOwner() {
	ownerType := models.MTOCommonSolutionOwnerType("BUSINESS_OWNER")
	cmsComponent := models.MTOCommonSolutionCMSComponent("OFFICE_OF_LEGISLATION")

	changes := map[string]interface{}{
		"ownerType":    &ownerType,    // Pass as a pointer
		"cmsComponent": &cmsComponent, // Pass as a pointer
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
}

// TestUpdateMTOCommonSolutionSystemOwner validates updating a system owner for a common solution.
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionSystemOwner() {
	ownerType := models.MTOCommonSolutionOwnerType("BUSINESS_OWNER")
	cmsComponent := models.MTOCommonSolutionCMSComponent("OFFICE_OF_LEGISLATION")

	changes := map[string]interface{}{
		"ownerType":    &ownerType,    // Pass as a pointer
		"cmsComponent": &cmsComponent, // Pass as a pointer
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

	updatedOwnerType := models.MTOCommonSolutionOwnerType("BUSINESS_OWNER")
	updatedCmsComponent := models.MTOCommonSolutionCMSComponent("CENTER_FOR_MEDICARE_CM")

	updatedChanges := map[string]interface{}{
		"ownerType":    &updatedOwnerType,    // Pass as a pointer
		"cmsComponent": &updatedCmsComponent, // Pass as a pointer
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
	suite.Equal(updatedChanges["ownerType"], &updatedSystemOwner.OwnerType)
	suite.Equal(updatedChanges["cmsComponent"], &updatedSystemOwner.CMSComponent)
}

// TestGetMTOCommonSolutionSystemOwner validates retrieving a system owner for a common solution by ID.
func (suite *ResolverSuite) TestGetMTOCommonSolutionSystemOwner() {
	ownerType := models.MTOCommonSolutionOwnerType("BUSINESS_OWNER")
	cmsComponent := models.MTOCommonSolutionCMSComponent("OFFICE_OF_LEGISLATION")

	changes := map[string]interface{}{
		"ownerType":    &ownerType,    // Pass as a pointer
		"cmsComponent": &cmsComponent, // Pass as a pointer
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
	ownerType := models.MTOCommonSolutionOwnerType("BUSINESS_OWNER")
	cmsComponent := models.MTOCommonSolutionCMSComponent("OFFICE_OF_LEGISLATION")

	changes := map[string]interface{}{
		"ownerType":    &ownerType,    // Pass as a pointer
		"cmsComponent": &cmsComponent, // Pass as a pointer
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
