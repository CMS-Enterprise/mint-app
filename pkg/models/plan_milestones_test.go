package models

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
)

func TestCalcStatus(t *testing.T) {
	now := time.Now()
	note := "Some note"
	phased := true

	// Ready
	// All status-validating fields are nil
	pmReady := PlanMilestones{
		ID:          utilityUUID.ValueOrNewUUID(uuid.Nil),
		ModelPlanID: utilityUUID.ValueOrNewUUID(uuid.Nil),
	}
	pmReady.CalcStatus()
	assert.Equal(t, TaskReady, pmReady.Status)

	// In Progress
	// CompleteICIP is nil
	pmInProgress := PlanMilestones{
		ID:                      utilityUUID.ValueOrNewUUID(uuid.Nil),
		ModelPlanID:             utilityUUID.ValueOrNewUUID(uuid.Nil),
		ClearanceStarts:         &now,
		ClearanceEnds:           &now,
		Announced:               &now,
		ApplicationsStart:       &now,
		ApplicationsEnd:         &now,
		PerformancePeriodStarts: &now,
		PerformancePeriodEnds:   &now,
		WrapUpEnds:              &now,
		HighLevelNote:           &note,
		PhasedIn:                &phased,
		PhasedInNote:            &note,
	}
	pmInProgress.CalcStatus()
	assert.Equal(t, TaskInProgress, pmInProgress.Status)

	// Complete
	pmComplete := PlanMilestones{
		ID:                      utilityUUID.ValueOrNewUUID(uuid.Nil),
		ModelPlanID:             utilityUUID.ValueOrNewUUID(uuid.Nil),
		CompleteICIP:            &now,
		ClearanceStarts:         &now,
		ClearanceEnds:           &now,
		Announced:               &now,
		ApplicationsStart:       &now,
		ApplicationsEnd:         &now,
		PerformancePeriodStarts: &now,
		PerformancePeriodEnds:   &now,
		WrapUpEnds:              &now,
		HighLevelNote:           &note,
		PhasedIn:                &phased,
		PhasedInNote:            &note,
	}
	pmComplete.CalcStatus()
	assert.Equal(t, TaskComplete, pmComplete.Status)
}
