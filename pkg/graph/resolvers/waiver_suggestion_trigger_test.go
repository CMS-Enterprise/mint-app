package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// medicarePaymentWaiver1ID is the stable ID for "Medicare Payment Waiver 1", seeded by V269.
var medicarePaymentWaiver1ID = uuid.MustParse("9f955945-7afd-481f-8558-e7e0fd465463")

func (suite *ResolverSuite) TestWaiverSuggestionTrigger() {
	// TODO: replace the inline SQL below with a native storage/resolver call once
	// CMS provides the real waiver-to-question mappings and a proper mechanism exists
	// to set common_waiver.survey_question_field via the app. Until then, inline SQL
	// is the only way to wire up a test fixture for this trigger.
	//
	// Wire "Medicare Payment Waiver 1" to the modifies_medicare_savings_programs survey
	// question so the trigger can un-suggest it when the answer is false.
	// common_waiver is seed/reference data that is not truncated between tests, so we
	// restore the field to NULL in a defer.
	tx, err := suite.testConfigs.Store.Beginx()
	suite.NoError(err)
	_, err = tx.NamedExec(
		`UPDATE common_waiver SET survey_question_field = :field WHERE id = :id`,
		map[string]any{
			"field": "modifies_medicare_savings_programs",
			"id":    medicarePaymentWaiver1ID,
		},
	)
	suite.NoError(err)
	suite.NoError(tx.Commit())
	defer func() {
		tx2, err := suite.testConfigs.Store.Beginx()
		suite.NoError(err, "cleanup: begin transaction")
		if err != nil {
			return
		}
		_, err = tx2.NamedExec(
			`UPDATE common_waiver SET survey_question_field = NULL WHERE id = :id`,
			map[string]any{"id": medicarePaymentWaiver1ID},
		)
		suite.NoError(err, "cleanup: reset survey_question_field")
		suite.NoError(tx2.Commit(), "cleanup: commit transaction")
	}()

	// Creating a model plan triggers the INSERT trigger on waiver_assessment_survey,
	// which seeds ALL common waivers as suggested (all survey fields are NULL at creation).
	plan := suite.createModelPlan("plan for waiver suggestion trigger")

	allWaivers, err := GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	suite.assertNumCommonWaiversSuggested(allWaivers, 15)
	suite.assertCommonWaiverSuggestion(allWaivers, "Medicare Payment Waiver 1", true)

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
	suite.assertNumCommonWaiversSuggested(allWaivers, 14)
	suite.assertCommonWaiverSuggestion(allWaivers, "Medicare Payment Waiver 1", false)

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
	suite.assertNumCommonWaiversSuggested(allWaivers, 15)
	suite.assertCommonWaiverSuggestion(allWaivers, "Medicare Payment Waiver 1", true)
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
