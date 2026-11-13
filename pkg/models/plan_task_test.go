package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanTaskKeyIsManuallyMarkable(t *testing.T) {
	assert.True(t, PlanTaskKeyTwoPager.IsManuallyMarkable())
	assert.True(t, PlanTaskKeySixPager.IsManuallyMarkable())
	assert.True(t, PlanTaskKeyOaPresentation.IsManuallyMarkable())
	assert.True(t, PlanTaskKeyApprovedIcip.IsManuallyMarkable())
	assert.False(t, PlanTaskKeyPrepareForClearance.IsManuallyMarkable())

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
		PlanTaskKeyPrepareForClearance,
		PlanTaskKeyApprovedIcip,
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
	assert.Equal(
		t,
		"Prepare for your presentation to the Office of the Administrator",
		PlanTaskKeyOaPresentation.ChangeHistoryDisplayName(),
	)
	assert.Equal(t, "Add approved ICIP", PlanTaskKeyApprovedIcip.ChangeHistoryDisplayName())

	// Keys without a change-history-specific name fall back to DisplayName()
	assert.Equal(t, PlanTaskKeyModelPlan.DisplayName(), PlanTaskKeyModelPlan.ChangeHistoryDisplayName())
	assert.Equal(t, PlanTaskKey("NOT_A_REAL_KEY").DisplayName(), PlanTaskKey("NOT_A_REAL_KEY").ChangeHistoryDisplayName())
}

func TestApprovedIcipApplies(t *testing.T) {
	assert.True(t, ApprovedIcipApplies([]string{"MEDICARE_FFS_MODEL"}))
	assert.True(t, ApprovedIcipApplies([]string{"PART_C", "MEDICARE_FFS_MODEL"}))
	assert.False(t, ApprovedIcipApplies([]string{"PART_C", "MEDICAID_MODEL"}))
	assert.False(t, ApprovedIcipApplies([]string{}))
	assert.False(t, ApprovedIcipApplies(nil))
}

func TestApprovedIcipStateForModelStatus(t *testing.T) {
	for _, status := range []ModelStatus{ModelStatusPlanDraft, ModelStatusPlanComplete, ModelStatusIcipComplete} {
		state, ok := ApprovedIcipStateForModelStatus(status)
		assert.True(t, ok, status)
		assert.Equal(t, PlanTaskStateUpcoming, state, status)
	}

	for _, status := range []ModelStatus{
		ModelStatusInternalCmmiClearance,
		ModelStatusCmsClearance,
		ModelStatusHhsClearance,
		ModelStatusOmbAsrfClearance,
		ModelStatusCleared,
		ModelStatusAnnounced,
		ModelStatusActive,
		ModelStatusEnded,
	} {
		state, ok := ApprovedIcipStateForModelStatus(status)
		assert.True(t, ok, status)
		assert.Equal(t, PlanTaskStateToDo, state, status)
	}

	for _, status := range []ModelStatus{ModelStatusPaused, ModelStatusCanceled, ModelStatus("NOT_A_STATUS")} {
		_, ok := ApprovedIcipStateForModelStatus(status)
		assert.False(t, ok, status)
	}
}

func TestDefaultPlanTasksSeedsApprovedIcipNotNeeded(t *testing.T) {
	for _, task := range DefaultPlanTasks {
		if task.Key == PlanTaskKeyApprovedIcip {
			assert.Equal(t, PlanTaskStateNotNeeded, task.State)
			return
		}
	}
	t.Fatal("APPROVED_ICIP missing from DefaultPlanTasks")
}
