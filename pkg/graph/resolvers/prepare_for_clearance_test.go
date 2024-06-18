package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

type testDates struct {
	jan25 time.Time
	jan15 time.Time
	jan05 time.Time
	jan01 time.Time
}

func getTestDates() *testDates {
	jan25, _ := time.Parse(time.RFC3339, "2022-01-25T12:00:00Z")
	jan15, _ := time.Parse(time.RFC3339, "2022-01-15T12:00:00Z")
	jan05, _ := time.Parse(time.RFC3339, "2022-01-05T12:00:00Z")
	jan01, _ := time.Parse(time.RFC3339, "2022-01-01T12:00:00Z")
	return &testDates{
		jan25: jan25,
		jan15: jan15,
		jan05: jan05,
		jan01: jan01,
	}
}

// TestReadyForClearanceRead tests ReadyForClearanceRead
func (suite *ResolverSuite) TestReadyForClearanceRead() {
	plan := suite.createModelPlan("Plan for Clearance")

	// No updates to model plan - shouldn't be ready to start
	planClearance, err := ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, planClearance.Status)
	suite.Nil(planClearance.LatestClearanceDts)

	// Update the basics to have a clearance date set that's too far out (more than 20 days)
	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"clearanceStarts": time.Now().Add(time.Hour * 24 * 21).Format(time.RFC3339), // 21 days from now
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	// Clearance start date is 21 days out, still shouldn't be ready to start
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, planClearance.Status)
	suite.Nil(planClearance.LatestClearanceDts)

	// Update the basics to have a clearance date set that's within the date range (15 days)
	basics, err = PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"clearanceStarts": time.Now().Add(time.Hour * 24 * 15).Format(time.RFC3339), // 15 days from now
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	// Clearance start date is 15 days out - should be "Ready to Start"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusReady, planClearance.Status)
	suite.Nil(planClearance.LatestClearanceDts)

	// Update the basics to be marked ready for clearance
	basics, err = PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"status": model.TaskStatusInputReadyForClearance,
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've started by marking Basics as ready for clearance - should be "In Progress"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	// Save the latest clearance DTS, as the next time we update one, it should be later than this one
	// Yes, this _IS_ sketchy, as it's possible this test flakes if both the previous setting of the clearanceDts and the next
	// happen within the same millisecond. I just assume that's not going to happen :)
	previousLatestClearanceDts := *planClearance.LatestClearanceDts

	// Update the general characteristics to be marked ready for clearance
	genChar, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, genChar.ID, map[string]interface{}{
		"status": model.TaskStatusInputReadyForClearance,
	}, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've marked General Characteristics as ready for clearance - should still be "In Progress"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	suite.True(planClearance.LatestClearanceDts.After(previousLatestClearanceDts)) // this new clearanceDts should be after the last one we saw
	previousLatestClearanceDts = *planClearance.LatestClearanceDts

	// Update the participants and providers to be marked ready for clearance
	participants, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, participants.ID, map[string]interface{}{
		"status": model.TaskStatusInputReadyForClearance,
	}, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've marked Participants & Providers as ready for clearance - should still be "In Progress"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	suite.True(planClearance.LatestClearanceDts.After(previousLatestClearanceDts)) // this new clearanceDts should be after the last one we saw
	previousLatestClearanceDts = *planClearance.LatestClearanceDts

	// Update the participants and providers to be marked ready for clearance
	benes, err := PlanBeneficiariesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = PlanBeneficiariesUpdate(suite.testConfigs.Logger, benes.ID, map[string]interface{}{
		"status": model.TaskStatusInputReadyForClearance,
	}, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've marked Beneficiaries as ready for clearance - should still be "In Progress"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	suite.True(planClearance.LatestClearanceDts.After(previousLatestClearanceDts)) // this new clearanceDts should be after the last one we saw
	previousLatestClearanceDts = *planClearance.LatestClearanceDts

	// Update the ops, eval, & learning to be marked ready for clearance
	opsEvalLearning, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, opsEvalLearning.ID, map[string]interface{}{
		"status": model.TaskStatusInputReadyForClearance,
	}, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've marked ops, eval, & learning as ready for clearance - should still be "In Progress"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	suite.True(planClearance.LatestClearanceDts.After(previousLatestClearanceDts)) // this new clearanceDts should be after the last one we saw
	previousLatestClearanceDts = *planClearance.LatestClearanceDts

	// Update the payments to be marked ready for clearance
	// NOTE: This is the final section, so we expect the status to change!
	payments, err := PlanPaymentsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = PlanPaymentsUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, payments.ID, map[string]interface{}{
		"status": model.TaskStatusInputReadyForClearance,
	}, suite.testConfigs.Principal)
	suite.NoError(err)
	// Clearance start date is 15 days out & we've marked payments as ready for clearance - should finally be "Ready for Clearance"
	planClearance, err = ReadyForClearanceRead(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(model.PrepareForClearanceStatusReadyForClearance, planClearance.Status)
	suite.NotNil(planClearance.LatestClearanceDts)
	suite.True(planClearance.LatestClearanceDts.After(previousLatestClearanceDts)) // this new clearanceDts should be after the last one we saw
}

// TestCalculateStatusNoClearanceDate tests calculateStatus in the case that it should return a status of
// "Cannot Start" due to there not being a clearance start date
func (suite *ResolverSuite) TestCalculateStatusNoClearanceDate() {
	td := getTestDates()

	status := calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  nil, // No clearance date
		AllReadyForClearance:   true,
	}, td.jan01)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  nil, // No clearance date
		AllReadyForClearance:   true,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  nil, // No clearance date
		AllReadyForClearance:   false,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)
}

// TestCalculateStatusTooEarly tests calculateStatus in the case that it should return a status of
// "Cannot Start" due to being more than twenty days from the clearance date
func (suite *ResolverSuite) TestCalculateStatusTooEarly() {
	td := getTestDates()

	status := calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   true,
	}, td.jan01)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   true,
	}, td.jan01)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan01)
	suite.EqualValues(model.PrepareForClearanceStatusCannotStart, status)
}

// TestCalculateStatusAllReady tests calculateStatus in the case that it should return a status of
// "Ready for Clearance" due to it being less than 20 days from the clearance start and all sections
// being ready for clearance
func (suite *ResolverSuite) TestCalculateStatusAllReady() {
	td := getTestDates()

	status := calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   true,
	}, td.jan05)
	suite.EqualValues(model.PrepareForClearanceStatusReadyForClearance, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   true,
	}, td.jan15)
	suite.EqualValues(model.PrepareForClearanceStatusReadyForClearance, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   true,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusReadyForClearance, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan15,
		AllReadyForClearance:   true,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusReadyForClearance, status)
}

// TestCalculateStatusInProgress tests calculateStatus in the case that it should return a status of
// "In Progress" due to it being less than 20 days from the clearance start, not all sections are ready for clearance,
// and the most recent clearance dts is not nil
func (suite *ResolverSuite) TestCalculateStatusInProgress() {
	td := getTestDates()

	status := calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan01,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan05)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan15)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: &td.jan15,
		BasicsClearanceStarts:  &td.jan15,
		AllReadyForClearance:   false,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusInProgress, status)
}

// TestCalculateStatusReady tests calculateStatus in the case that it should return a status of
// "Ready to Start" due to it being less than 20 days from the clearance start, not all sections are ready for clearance,
// and the most recent clearance dts is nil
func (suite *ResolverSuite) TestCalculateStatusReady() {
	td := getTestDates()

	status := calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan05)
	suite.EqualValues(model.PrepareForClearanceStatusReady, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan15)
	suite.EqualValues(model.PrepareForClearanceStatusReady, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan25,
		AllReadyForClearance:   false,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusReady, status)

	status = calculateStatus(&models.PrepareForClearanceResponse{
		MostRecentClearanceDts: nil,
		BasicsClearanceStarts:  &td.jan15,
		AllReadyForClearance:   false,
	}, td.jan25)
	suite.EqualValues(model.PrepareForClearanceStatusReady, status)
}
