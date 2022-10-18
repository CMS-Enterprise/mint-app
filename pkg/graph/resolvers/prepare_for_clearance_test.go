package resolvers

import (
	"time"

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
	// TODO: Write this out :)
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
