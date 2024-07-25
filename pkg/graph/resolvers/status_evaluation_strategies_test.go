package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestICIPCompleteStrategy_Update() {
	strategy := &ICIPCompleteStrategy{}
	completeICIPTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusPlanDraft
	planBasics := &models.PlanBasics{
		CompleteICIP: &completeICIPTime,
	}

	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 1)
	suite.Equal(models.ModelStatusIcipComplete, status[0])
}

func (suite *ResolverSuite) TestICIPCompleteStrategy_NoUpdate() {
	strategy := &ICIPCompleteStrategy{}
	completeICIPTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusIcipComplete
	planBasics := &models.PlanBasics{
		CompleteICIP: &completeICIPTime,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}

func (suite *ResolverSuite) TestClearanceStartStrategy_Update() {
	strategy := &ClearanceStartStrategy{}
	clearanceStartTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusPlanDraft
	planBasics := &models.PlanBasics{
		ClearanceStarts: &clearanceStartTime,
	}

	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 4)
	suite.Equal(models.ModelStatusInternalCmmiClearance, status[0])
	suite.Equal(models.ModelStatusCmsClearance, status[1])
	suite.Equal(models.ModelStatusHhsClearance, status[2])
	suite.Equal(models.ModelStatusOmbAsrfClearance, status[3])
}

func (suite *ResolverSuite) TestClearanceStartStrategy_NoUpdate() {
	strategy := &ClearanceStartStrategy{}
	clearanceStartTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusInternalCmmiClearance
	planBasics := &models.PlanBasics{
		ClearanceStarts: &clearanceStartTime,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}

func (suite *ResolverSuite) TestClearanceEndStrategy_Update() {
	strategy := &ClearanceEndStrategy{}
	clearanceEndTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusInternalCmmiClearance
	planBasics := &models.PlanBasics{
		ClearanceEnds: &clearanceEndTime,
	}

	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 1)
	suite.Equal(models.ModelStatusCleared, status[0])
}

func (suite *ResolverSuite) TestClearanceEndStrategy_NoUpdate() {
	strategy := &ClearanceEndStrategy{}
	clearanceEndTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusCleared
	planBasics := &models.PlanBasics{
		ClearanceEnds: &clearanceEndTime,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}

func (suite *ResolverSuite) TestAnnounceStrategy_Update() {
	strategy := &AnnounceStrategy{}
	announceTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusCleared
	planBasics := &models.PlanBasics{
		Announced: &announceTime,
	}
	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 1)
	suite.Equal(models.ModelStatusAnnounced, status[0])
}

func (suite *ResolverSuite) TestAnnounceStrategy_NoUpdate() {
	strategy := &AnnounceStrategy{}
	announceTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusAnnounced
	planBasics := &models.PlanBasics{
		Announced: &announceTime,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}

func (suite *ResolverSuite) TestActiveStrategy_Update() {
	strategy := &ActiveStrategy{}
	performancePeriodStarts := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusAnnounced
	planBasics := &models.PlanBasics{
		PerformancePeriodStarts: &performancePeriodStarts,
	}

	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 1)
	suite.Equal(models.ModelStatusActive, status[0])
}

func (suite *ResolverSuite) TestActiveStrategy_NoUpdate() {
	strategy := &ActiveStrategy{}
	performancePeriodStarts := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusActive
	planBasics := &models.PlanBasics{
		PerformancePeriodStarts: &performancePeriodStarts,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}

func (suite *ResolverSuite) TestEndedStrategy_Update() {
	strategy := &EndedStrategy{}
	performancePeriodEnds := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusActive
	planBasics := &models.PlanBasics{
		PerformancePeriodEnds: &performancePeriodEnds,
	}

	status, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.True(shouldUpdate)
	suite.Len(status, 1)
	suite.Equal(models.ModelStatusEnded, status[0])
}

func (suite *ResolverSuite) TestEndedStrategy_NoUpdate() {
	strategy := &EndedStrategy{}
	performancePeriodEnds := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusEnded
	planBasics := &models.PlanBasics{
		PerformancePeriodEnds: &performancePeriodEnds,
	}

	_, shouldUpdate := strategy.Evaluate(modelPlanStatus, planBasics)
	suite.False(shouldUpdate)
}
