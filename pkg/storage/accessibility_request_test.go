package storage

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/facebookgo/clock"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestFetchAccessibilityRequestMetrics() {
	ctx := context.Background()

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	// create a random year to avoid test collisions
	// uses postgres max year minus 1000000
	rand.Seed(time.Now().UnixNano())
	// #nosec G404
	endYear := rand.Intn(294276)
	endDate := time.Date(endYear, 0, 0, 0, 0, 0, 0, time.UTC)
	startDate := endDate.AddDate(0, -1, 0)
	var startedTests = []struct {
		name          string
		createdAt     time.Time
		expectedCount int
	}{
		{"start time is included", startDate, 1},
		{"end time is not included", endDate, 1},
		{"mid time is included", startDate.AddDate(0, 0, 1), 2},
		{"before time is not included", startDate.AddDate(0, 0, -1), 2},
		{"after time is not included", endDate.AddDate(0, 0, 1), 2},
	}
	for _, tt := range startedTests {
		s.Run(fmt.Sprintf("%s for started count", tt.name), func() {
			settableClock.Set(tt.createdAt)
			request := testhelpers.NewAccessibilityRequest(intake.ID)
			_, err := s.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &request)
			s.NoError(err)
		})
	}
}

func (s StoreTestSuite) TestFetchAccessibilityRequestByID() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("retrieves an active accessibility request", func() {
		accessibilityRequest := models.AccessibilityRequest{
			IntakeID:  intake.ID,
			Name:      "My Accessibility Request",
			EUAUserID: "ASDF",
		}
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
		s.NoError(err)

		returnedAccessibilityRequest, fetchErr := s.store.FetchAccessibilityRequestByID(ctx, accessibilityRequest.ID)
		s.NoError(fetchErr)

		s.Equal(accessibilityRequest.ID, returnedAccessibilityRequest.ID)
	})

	s.Run("does not retrieve a deleted accessibility request", func() {
		deletedAccessibilityRequest := models.AccessibilityRequest{
			IntakeID:  intake.ID,
			Name:      "My Accessibility Request",
			EUAUserID: "ASDF",
		}
		_, err = s.store.CreateAccessibilityRequest(ctx, &deletedAccessibilityRequest)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(
			ctx, deletedAccessibilityRequest.ID,
			models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		_, err := s.store.FetchAccessibilityRequestByID(ctx, deletedAccessibilityRequest.ID)
		s.Error(err)
		s.Assertions.IsType(&apperrors.ResourceNotFoundError{}, err)
	})
}

func (s StoreTestSuite) TestFetchAccessibilityRequestByIDIncludingDeleted() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	deletedAccessibilityRequest := models.AccessibilityRequest{
		IntakeID:  intake.ID,
		Name:      "My Accessibility Request",
		EUAUserID: "ASDF",
	}
	_, err = s.store.CreateAccessibilityRequest(ctx, &deletedAccessibilityRequest)
	s.NoError(err)

	err = s.store.DeleteAccessibilityRequest(
		ctx, deletedAccessibilityRequest.ID, models.AccessibilityRequestDeletionReasonOther)
	s.NoError(err)

	returnedAccessibilityRequest, err := s.store.FetchAccessibilityRequestByIDIncludingDeleted(
		ctx, deletedAccessibilityRequest.ID)
	s.NoError(err)

	s.Equal(deletedAccessibilityRequest.ID, returnedAccessibilityRequest.ID)
}

func (s StoreTestSuite) TestFetchAccessibilityRequests() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("returns only not deleted accessibility requests", func() {
		requestsBefore, fetchError := s.store.FetchAccessibilityRequests(ctx)
		s.NoError(fetchError)

		newRequest1 := testhelpers.NewAccessibilityRequest(intake.ID)
		newRequest2 := testhelpers.NewAccessibilityRequest(intake.ID)

		_, err = s.store.CreateAccessibilityRequest(ctx, &newRequest1)
		s.NoError(err)

		_, err = s.store.CreateAccessibilityRequest(ctx, &newRequest2)
		s.NoError(err)

		newRequest3Deleted := models.AccessibilityRequest{
			IntakeID:  intake.ID,
			Name:      "My Deleted Request",
			EUAUserID: "ASDF",
		}
		_, err = s.store.CreateAccessibilityRequest(ctx, &newRequest3Deleted)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(
			ctx, newRequest3Deleted.ID, models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		requests, fetchError := s.store.FetchAccessibilityRequests(ctx)
		s.NoError(fetchError)
		expectedNumRequests := len(requestsBefore) + 2
		s.Equal(expectedNumRequests, len(requests))
	})
}
