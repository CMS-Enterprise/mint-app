package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

const productionCommonWaiverCount = 31

func (suite *ResolverSuite) TestWaiverSuggestionTrigger() {
	// Creating a model plan triggers the INSERT trigger on waiver_assessment_survey,
	// which seeds ALL common waivers as suggested (all survey fields are NULL at creation).
	plan := suite.createModelPlan("plan for waiver suggestion trigger")

	allWaivers, err := GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	suite.Len(allWaivers, productionCommonWaiverCount)
	suite.assertNumCommonWaiversSuggested(allWaivers, productionCommonWaiverCount)
	suite.assertCommonWaiverSuggestion(allWaivers, "Non-duplication", true)

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(survey)

	// Answering modifies_medicare_savings_programs=false fires the UPDATE trigger, which
	// deletes and recalculates suggestions. Waivers tied to this question are un-suggested.
	_, err = WaiverAssessmentSurveyUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		survey.ID,
		map[string]interface{}{"modifiesMedicareSavingsPrograms": false},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	allWaivers, err = GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	suite.assertNumCommonWaiversSuggested(allWaivers, productionCommonWaiverCount-2)
	suite.assertCommonWaiverSuggestion(allWaivers, "Non-duplication", false)

	// Switching the answer to true re-suggests the waiver.
	_, err = WaiverAssessmentSurveyUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		survey.ID,
		map[string]interface{}{"modifiesMedicareSavingsPrograms": true},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	allWaivers, err = GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	suite.assertNumCommonWaiversSuggested(allWaivers, productionCommonWaiverCount)
	suite.assertCommonWaiverSuggestion(allWaivers, "Non-duplication", true)
}

func (suite *ResolverSuite) assertCommonWaiverSuggestion(waivers []*models.CommonWaiver, nameToFind string, expectedSuggested bool) {
	waiver, _ := lo.Find(waivers, func(cw *models.CommonWaiver) bool {
		return cw.Name == nameToFind
	})
	if suite.NotNil(waiver, "expected to find waiver %q in results", nameToFind) {
		suite.Equal(expectedSuggested, waiver.IsSuggested(), "waiver %q isSuggested mismatch", nameToFind)
	}
}

func (suite *ResolverSuite) assertNumCommonWaiversSuggested(waivers []*models.CommonWaiver, expectedNum int) {
	actualNum := lo.CountBy(waivers, func(cw *models.CommonWaiver) bool {
		return cw.IsSuggested()
	})
	suite.Equal(expectedNum, actualNum)
}
