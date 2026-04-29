package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func TestFormatMTOCommonMilestoneCategory(t *testing.T) {
	subCategory := "Internal functions"
	blankSubCategory := " "

	tests := map[string]struct {
		categoryName    string
		subCategoryName *string
		expected        string
	}{
		"category only": {
			categoryName: "Operations",
			expected:     "Operations",
		},
		"category with subcategory": {
			categoryName:    "Operations",
			subCategoryName: &subCategory,
			expected:        "Operations (Internal functions)",
		},
		"blank subcategory": {
			categoryName:    "Operations",
			subCategoryName: &blankSubCategory,
			expected:        "Operations",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			actual := formatMTOCommonMilestoneCategory(test.categoryName, test.subCategoryName)
			assert.Equal(t, test.expected, actual)
		})
	}
}

func TestFormatMTOCommonMilestoneFacilitators(t *testing.T) {
	otherText := "State operations team"
	blankOtherText := " "

	tests := map[string]struct {
		facilitatedByRoles []models.MTOFacilitator
		facilitatedByOther *string
		expected           string
	}{
		"no facilitators": {
			expected: "None",
		},
		"standard facilitators preserve input order": {
			facilitatedByRoles: []models.MTOFacilitator{
				models.MTOFacilitatorSolutionArchitect,
				models.MTOFacilitatorITLead,
			},
			expected: "Solution Architect, IT Lead",
		},
		"other is rendered last with description": {
			facilitatedByRoles: []models.MTOFacilitator{
				models.MTOFacilitatorOther,
				models.MTOFacilitatorITLead,
				models.MTOFacilitatorModelLead,
			},
			facilitatedByOther: &otherText,
			expected:           "IT Lead, Model Lead, Other (State operations team)",
		},
		"other is rendered last without blank description": {
			facilitatedByRoles: []models.MTOFacilitator{
				models.MTOFacilitatorOther,
				models.MTOFacilitatorModelTeam,
			},
			facilitatedByOther: &blankOtherText,
			expected:           "Model team, Other",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			actual := formatMTOCommonMilestoneFacilitators(test.facilitatedByRoles, test.facilitatedByOther)
			assert.Equal(t, test.expected, actual)
		})
	}
}

func TestHumanizeMTOFacilitator(t *testing.T) {
	tests := map[models.MTOFacilitator]string{
		models.MTOFacilitatorITLead:                               "IT Lead",
		models.MTOFacilitatorModelTeam:                            "Model team",
		models.MTOFacilitatorModelLead:                            "Model Lead",
		models.MTOFacilitatorModelDataLead:                        "Model Data Lead",
		models.MTOFacilitatorSolutionArchitect:                    "Solution Architect",
		models.MTOFacilitatorITSystemProductOwner:                 "IT System Product Owner",
		models.MTOFacilitatorApplicationSupportContractor:         "Application support contractor",
		models.MTOFacilitatorDataAnalyticsContractor:              "Data analytics contractor",
		models.MTOFacilitatorEvaluationContractor:                 "Evaluation contractor",
		models.MTOFacilitatorImplementationContractor:             "Implementation contractor",
		models.MTOFacilitatorLearningContractor:                   "Learning contractor",
		models.MTOFacilitatorMonitoringContractor:                 "Monitoring contractor",
		models.MTOFacilitatorQualityMeasuresDevelopmentContractor: "Quality measures development contractor",
		models.MTOFacilitatorContractingOfficersRepresentative:    "Contracting Officers Representative (COR)",
		models.MTOFacilitatorLearningAndDiffusionGroup:            "Learning and Diffusion Group (LDG)",
		models.MTOFacilitatorResearchAndRapidCycleEvaluationGroup: "Research and Rapid Cycle Evaluation Group (RREG)",
		models.MTOFacilitatorParticipants:                         "Participants",
		models.MTOFacilitatorOther:                                "Other",
		"SOME_UNKNOWN_ROLE":                                       "SOME UNKNOWN ROLE",
	}

	for facilitator, expected := range tests {
		t.Run(string(facilitator), func(t *testing.T) {
			actual := humanizeMTOFacilitator(facilitator)
			assert.Equal(t, expected, actual)
		})
	}
}

func TestFormatMTOCommonMilestoneSolutions(t *testing.T) {
	tests := map[string]struct {
		commonSolutions []*models.MTOCommonSolution
		expected        string
	}{
		"no solutions": {
			expected: "None",
		},
		"ignores empty values and sorts deduped solution names": {
			commonSolutions: []*models.MTOCommonSolution{
				nil,
				{Name: "Salesforce CONNECT"},
				{Name: "4innovation (4i)"},
				{Name: "Salesforce CONNECT"},
				{Name: ""},
			},
			expected: "4innovation (4i), Salesforce CONNECT",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			actual := formatMTOCommonMilestoneSolutions(test.commonSolutions)
			assert.Equal(t, test.expected, actual)
		})
	}
}

func (suite *ResolverSuite) TestCreateMTOCommonMilestone() {
	actorUserID := suite.testConfigs.Principal.UserAccount.ID
	subCategoryName := "Resolver create tests"
	facilitatedByOther := "Cross-team support"

	createdMilestone, err := CreateMTOCommonMilestone(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
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
		suite.testConfigs.Principal.UserAccount.CommonName,
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
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		"Resolver update common milestone test",
		"Temporary common milestone used for resolver update testing.",
		"Operations",
		&subCategoryName,
		[]models.MTOFacilitator{models.MTOFacilitatorOther},
		&facilitatedByOther,
		[]models.MTOCommonSolutionKey{models.MTOCSKInnovation},
		actorUserID,
		suite.testConfigs.Principal.UserAccount.CommonName,
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
		nil,
		email.AddressBook{},
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
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		"Archive resolver test milestone",
		"Temporary common milestone used for resolver archive testing.",
		"Operations",
		&subCategoryName,
		[]models.MTOFacilitator{models.MTOFacilitatorITLead},
		nil,
		[]models.MTOCommonSolutionKey{models.MTOCSKInnovation},
		actorUserID,
		suite.testConfigs.Principal.UserAccount.CommonName,
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
		nil,
		email.AddressBook{},
		commonMilestoneID,
		actorUserID,
		suite.testConfigs.Principal.UserAccount.CommonName,
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
