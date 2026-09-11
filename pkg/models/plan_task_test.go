package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanTaskKeyIsManuallyMarkable(t *testing.T) {
	assert.True(t, PlanTaskKeyTwoPager.IsManuallyMarkable())
	assert.True(t, PlanTaskKeySixPager.IsManuallyMarkable())

	assert.False(t, PlanTaskKeyModelPlan.IsManuallyMarkable())
	assert.False(t, PlanTaskKeyMto.IsManuallyMarkable())
	assert.False(t, PlanTaskKeyDataExchange.IsManuallyMarkable())

	assert.False(t, PlanTaskKey("NOT_A_REAL_KEY").IsManuallyMarkable())
}

func TestPlanTaskKeyActivationTarget(t *testing.T) {
	target, ok := PlanTaskKeyTwoPager.ActivationTarget()
	assert.True(t, ok)
	assert.Equal(t, PlanTaskKeySixPager, target)

	target, ok = PlanTaskKeySixPager.ActivationTarget()
	assert.True(t, ok)
	assert.Equal(t, PlanTaskKeyOaPresentation, target)

	for _, key := range []PlanTaskKey{
		PlanTaskKeyModelPlan,
		PlanTaskKeyMto,
		PlanTaskKeyDataExchange,
		PlanTaskKeyOaPresentation,
		PlanTaskKey("NOT_A_REAL_KEY"),
	} {
		_, ok := key.ActivationTarget()
		assert.False(t, ok, "expected key %s to have no activation target", key)
	}
}

func TestPlanTaskKeyChangeHistoryDisplayName(t *testing.T) {
	assert.Equal(
		t,
		"Prepare for your 2-page review meeting with CMMI Front Office",
		PlanTaskKeyTwoPager.ChangeHistoryDisplayName(),
	)
	assert.Equal(
		t,
		"Prepare for your 6-page review meeting with CMMI Front Office",
		PlanTaskKeySixPager.ChangeHistoryDisplayName(),
	)

	// Keys without a change-history-specific name fall back to DisplayName()
	assert.Equal(t, PlanTaskKeyModelPlan.DisplayName(), PlanTaskKeyModelPlan.ChangeHistoryDisplayName())
	assert.Equal(t, PlanTaskKey("NOT_A_REAL_KEY").DisplayName(), PlanTaskKey("NOT_A_REAL_KEY").ChangeHistoryDisplayName())
}
