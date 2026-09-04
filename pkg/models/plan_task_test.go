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

	for _, key := range []PlanTaskKey{
		PlanTaskKeyModelPlan,
		PlanTaskKeyMto,
		PlanTaskKeyDataExchange,
		PlanTaskKeySixPager,
		PlanTaskKey("NOT_A_REAL_KEY"),
	} {
		_, ok := key.ActivationTarget()
		assert.False(t, ok, "expected key %s to have no activation target", key)
	}
}
