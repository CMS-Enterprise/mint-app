package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

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
		"Prepare for your 2-page review meeting with CMMI Front Office (FO)",
		PlanTaskKeyTwoPager.ChangeHistoryDisplayName(),
	)

	// Keys without a change-history-specific name fall back to DisplayName()
	assert.Equal(t, PlanTaskKeyModelPlan.DisplayName(), PlanTaskKeyModelPlan.ChangeHistoryDisplayName())
	assert.Equal(t, PlanTaskKey("NOT_A_REAL_KEY").DisplayName(), PlanTaskKey("NOT_A_REAL_KEY").ChangeHistoryDisplayName())
}
