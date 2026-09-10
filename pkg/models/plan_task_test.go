package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestPrepareForClearanceTaskStatus(t *testing.T) {
	now := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

	daysFromNow := func(days int) *time.Time {
		t := now.AddDate(0, 0, days)
		return &t
	}

	t.Run("stays UPCOMING when clearance start date isn't set", func(t *testing.T) {
		status := PrepareForClearanceTaskStatus(PlanTaskStatusUpcoming, nil, now)
		assert.Equal(t, PlanTaskStatusUpcoming, status)
	})

	t.Run("stays UPCOMING when clearance is more than 20 days away", func(t *testing.T) {
		status := PrepareForClearanceTaskStatus(PlanTaskStatusUpcoming, daysFromNow(21), now)
		assert.Equal(t, PlanTaskStatusUpcoming, status)
	})

	t.Run("becomes TO_DO exactly 20 days before clearance", func(t *testing.T) {
		status := PrepareForClearanceTaskStatus(PlanTaskStatusUpcoming, daysFromNow(20), now)
		assert.Equal(t, PlanTaskStatusToDo, status)
	})

	t.Run("becomes TO_DO when within 20 days of clearance", func(t *testing.T) {
		status := PrepareForClearanceTaskStatus(PlanTaskStatusUpcoming, daysFromNow(5), now)
		assert.Equal(t, PlanTaskStatusToDo, status)
	})

	t.Run("becomes TO_DO once the clearance date has passed", func(t *testing.T) {
		status := PrepareForClearanceTaskStatus(PlanTaskStatusUpcoming, daysFromNow(-5), now)
		assert.Equal(t, PlanTaskStatusToDo, status)
	})

	t.Run("leaves a non-UPCOMING stored status untouched", func(t *testing.T) {
		for _, storedStatus := range []PlanTaskStatus{PlanTaskStatusToDo, PlanTaskStatusInProgress, PlanTaskStatusComplete, PlanTaskStatusNotNeeded} {
			status := PrepareForClearanceTaskStatus(storedStatus, daysFromNow(1), now)
			assert.Equal(t, storedStatus, status)
		}
	})
}

func TestPlanTaskKeyIsManuallyMarkable(t *testing.T) {
	assert.True(t, PlanTaskKeyTwoPager.IsManuallyMarkable())

	assert.False(t, PlanTaskKeyModelPlan.IsManuallyMarkable())
	assert.False(t, PlanTaskKeyMto.IsManuallyMarkable())
	assert.False(t, PlanTaskKeyDataExchange.IsManuallyMarkable())

	assert.False(t, PlanTaskKey("NOT_A_REAL_KEY").IsManuallyMarkable())
}

func TestPlanTaskKeyChangeHistoryDisplayName(t *testing.T) {
	assert.Equal(
		t,
		"Prepare for your 2-page review meeting with CMMI Front Office",
		PlanTaskKeyTwoPager.ChangeHistoryDisplayName(),
	)

	// Keys without a change-history-specific name fall back to DisplayName()
	assert.Equal(t, PlanTaskKeyModelPlan.DisplayName(), PlanTaskKeyModelPlan.ChangeHistoryDisplayName())
	assert.Equal(t, PlanTaskKey("NOT_A_REAL_KEY").DisplayName(), PlanTaskKey("NOT_A_REAL_KEY").ChangeHistoryDisplayName())
}
