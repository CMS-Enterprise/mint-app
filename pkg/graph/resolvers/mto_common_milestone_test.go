package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestCreateMTOCommonMilestone() {
	actorUserID := suite.testConfigs.Principal.UserAccount.ID
	subCategoryName := "Resolver create tests"
	facilitatedByOther := "Cross-team support"

	createdMilestone, err := CreateMTOCommonMilestone(
		suite.testConfigs.Store,
		"Resolver create common milestone test",
		"Temporary common milestone used for resolver create testing.",
		"Operations",
		&subCategoryName,
		[]models.MTOFacilitator{models.MTOFacilitatorOther},
		&facilitatedByOther,
		[]models.MTOCommonSolutionKey{
			models.MTOCSKInnovation,
			models.MTOCSKInnovation,
			models.MTOCSKAcoOs,
		},
		actorUserID,
	)
	suite.NoError(err)
	suite.Require().NotNil(createdMilestone)
	suite.T().Cleanup(func() {
		suite.NoError(deleteTestMTOCommonMilestone(
			suite.testConfigs.Store,
			createdMilestone.ID,
		))
	})

	suite.NotEqual(uuid.Nil, createdMilestone.ID)
	suite.Equal("Resolver create common milestone test", createdMilestone.Name)
	suite.Equal("Temporary common milestone used for resolver create testing.", createdMilestone.Description)
	suite.Equal("Operations", createdMilestone.CategoryName)
	suite.Require().NotNil(createdMilestone.SubCategoryName)
	suite.Equal(subCategoryName, *createdMilestone.SubCategoryName)
	suite.Equal(models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorOther}, createdMilestone.FacilitatedByRole)
	suite.Require().NotNil(createdMilestone.FacilitatedByOther)
	suite.Equal(facilitatedByOther, *createdMilestone.FacilitatedByOther)
	suite.False(createdMilestone.IsArchived)
	suite.False(createdMilestone.IsAdded)

	commonSolutions, err := storage.MTOCommonSolutionGetByCommonMilestoneIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{createdMilestone.ID},
	)
	suite.NoError(err)
	suite.Len(commonSolutions, 2)
}

func (suite *ResolverSuite) TestUpdateMTOCommonMilestone() {
	actorUserID := suite.testConfigs.Principal.UserAccount.ID
	subCategoryName := "Resolver update tests"
	facilitatedByOther := "Cross-team support"

	createdMilestone, err := CreateMTOCommonMilestone(
		suite.testConfigs.Store,
		"Resolver update common milestone test",
		"Temporary common milestone used for resolver update testing.",
		"Operations",
		&subCategoryName,
		[]models.MTOFacilitator{models.MTOFacilitatorOther},
		&facilitatedByOther,
		[]models.MTOCommonSolutionKey{models.MTOCSKInnovation},
		actorUserID,
	)
	suite.Require().NoError(err)
	suite.Require().NotNil(createdMilestone)
	suite.T().Cleanup(func() {
		suite.NoError(deleteTestMTOCommonMilestone(
			suite.testConfigs.Store,
			createdMilestone.ID,
		))
	})

	updatedName := "Resolver updated common milestone test"
	updatedDescription := "Updated common milestone from resolver test."
	updatedCategoryName := "Participants"

	updatedMilestone, err := UpdateMTOCommonMilestone(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		createdMilestone.ID,
		map[string]any{
			"name":               updatedName,
			"description":        updatedDescription,
			"categoryName":       updatedCategoryName,
			"subCategoryName":    nil,
			"facilitatedByRole":  []models.MTOFacilitator{models.MTOFacilitatorModelTeam},
			"facilitatedByOther": nil,
		},
		[]models.MTOCommonSolutionKey{models.MTOCSKAcoOs, models.MTOCSKAcoOs},
	)
	suite.NoError(err)
	suite.Require().NotNil(updatedMilestone)
	suite.Equal(createdMilestone.ID, updatedMilestone.ID)
	suite.Equal(updatedName, updatedMilestone.Name)
	suite.Equal(updatedDescription, updatedMilestone.Description)
	suite.Equal(updatedCategoryName, updatedMilestone.CategoryName)
	suite.Nil(updatedMilestone.SubCategoryName)
	suite.Equal(models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorModelTeam}, updatedMilestone.FacilitatedByRole)
	suite.Nil(updatedMilestone.FacilitatedByOther)

	commonSolutions, err := storage.MTOCommonSolutionGetByCommonMilestoneIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{createdMilestone.ID},
	)
	suite.NoError(err)
	suite.Require().Len(commonSolutions, 1)
	suite.Equal(models.MTOCSKAcoOs, commonSolutions[0].Key)
}

func (suite *ResolverSuite) TestArchiveMTOCommonMilestone() {
	actorUserID := suite.testConfigs.Principal.UserAccount.ID

	subCategoryName := "Archive tests"
	createdMilestone, err := CreateMTOCommonMilestone(
		suite.testConfigs.Store,
		"Archive resolver test milestone",
		"Temporary common milestone used for resolver archive testing.",
		"Operations",
		&subCategoryName,
		[]models.MTOFacilitator{models.MTOFacilitatorITLead},
		nil,
		[]models.MTOCommonSolutionKey{models.MTOCSKInnovation},
		actorUserID,
	)
	suite.Require().NoError(err)
	suite.Require().NotNil(createdMilestone)
	commonMilestoneID := createdMilestone.ID
	suite.T().Cleanup(func() {
		suite.NoError(deleteTestMTOCommonMilestone(
			suite.testConfigs.Store,
			commonMilestoneID,
		))
	})

	archivedMilestone, err := ArchiveMTOCommonMilestone(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		commonMilestoneID,
		actorUserID,
	)
	suite.NoError(err)
	if suite.NotNil(archivedMilestone) {
		suite.Equal(commonMilestoneID, archivedMilestone.ID)
		suite.True(archivedMilestone.IsArchived)
	}

	reloaded, err := storage.MTOCommonMilestoneGetByIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{commonMilestoneID},
	)
	suite.NoError(err)
	if suite.Len(reloaded, 1) {
		suite.True(reloaded[0].IsArchived)
	}
}

func deleteTestMTOCommonMilestone(np sqlutils.NamedPreparer, id uuid.UUID) error {
	err := sqlutils.ExecProcedure(
		np,
		`DELETE FROM mto_common_milestone_solution_link WHERE mto_common_milestone_id = :id`,
		map[string]any{
			"id": id,
		},
	)
	if err != nil {
		return err
	}

	return sqlutils.ExecProcedure(
		np,
		`DELETE FROM mto_common_milestone WHERE id = :id`,
		map[string]any{
			"id": id,
		},
	)
}
