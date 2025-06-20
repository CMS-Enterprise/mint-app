package resolvers

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestICIPCompleteStrategy_Update() {
	strategy := &ICIPCompleteStrategy{}
	completeICIPTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusPlanDraft
	timeline := &models.Timeline{
		CompleteICIP: &completeICIPTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 1)
	suite.Equal(models.ModelStatusIcipComplete, suggestedPhase.SuggestedStatuses[0])
}

func (suite *ResolverSuite) TestICIPCompleteStrategy_NoUpdate() {
	strategy := &ICIPCompleteStrategy{}
	completeICIPTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusIcipComplete
	timeline := &models.Timeline{
		CompleteICIP: &completeICIPTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}

func (suite *ResolverSuite) TestClearanceStartStrategy_Update() {
	strategy := &ClearanceStartStrategy{}
	clearanceStartTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusPlanDraft
	timeline := &models.Timeline{
		ClearanceStarts: &clearanceStartTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 4)
	suite.Equal(models.ModelStatusInternalCmmiClearance, suggestedPhase.SuggestedStatuses[0])
	suite.Equal(models.ModelStatusCmsClearance, suggestedPhase.SuggestedStatuses[1])
	suite.Equal(models.ModelStatusHhsClearance, suggestedPhase.SuggestedStatuses[2])
	suite.Equal(models.ModelStatusOmbAsrfClearance, suggestedPhase.SuggestedStatuses[3])
}

func (suite *ResolverSuite) TestClearanceStartStrategy_NoUpdate() {
	strategy := &ClearanceStartStrategy{}
	clearanceStartTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusInternalCmmiClearance
	timeline := &models.Timeline{
		ClearanceStarts: &clearanceStartTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}

func (suite *ResolverSuite) TestClearanceEndStrategy_Update() {
	strategy := &ClearanceEndStrategy{}
	clearanceEndTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusInternalCmmiClearance
	timeline := &models.Timeline{
		ClearanceEnds: &clearanceEndTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 1)
	suite.Equal(models.ModelStatusCleared, suggestedPhase.SuggestedStatuses[0])
}

func (suite *ResolverSuite) TestClearanceEndStrategy_NoUpdate() {
	strategy := &ClearanceEndStrategy{}
	clearanceEndTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusCleared
	timeline := &models.Timeline{
		ClearanceEnds: &clearanceEndTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}

func (suite *ResolverSuite) TestAnnounceStrategy_Update() {
	strategy := &AnnounceStrategy{}
	announceTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusCleared
	timeline := &models.Timeline{
		Announced: &announceTime,
	}
	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 1)
	suite.Equal(models.ModelStatusAnnounced, suggestedPhase.SuggestedStatuses[0])
}

func (suite *ResolverSuite) TestAnnounceStrategy_NoUpdate() {
	strategy := &AnnounceStrategy{}
	announceTime := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusAnnounced
	timeline := &models.Timeline{
		Announced: &announceTime,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}

func (suite *ResolverSuite) TestActiveStrategy_Update() {
	strategy := &ActiveStrategy{}
	performancePeriodStarts := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusAnnounced
	timeline := &models.Timeline{
		PerformancePeriodStarts: &performancePeriodStarts,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 1)
	suite.Equal(models.ModelStatusActive, suggestedPhase.SuggestedStatuses[0])
}

func (suite *ResolverSuite) TestActiveStrategy_NoUpdate() {
	strategy := &ActiveStrategy{}
	performancePeriodStarts := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusActive
	timeline := &models.Timeline{
		PerformancePeriodStarts: &performancePeriodStarts,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}

func (suite *ResolverSuite) TestEndedStrategy_Update() {
	strategy := &EndedStrategy{}
	performancePeriodEnds := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusActive
	timeline := &models.Timeline{
		PerformancePeriodEnds: &performancePeriodEnds,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.NotNil(suggestedPhase)
	suite.Len(suggestedPhase.SuggestedStatuses, 1)
	suite.Equal(models.ModelStatusEnded, suggestedPhase.SuggestedStatuses[0])
}

func (suite *ResolverSuite) TestEndedStrategy_NoUpdate() {
	strategy := &EndedStrategy{}
	performancePeriodEnds := time.Now().Add(-time.Hour)

	modelPlanStatus := models.ModelStatusEnded
	timeline := &models.Timeline{
		PerformancePeriodEnds: &performancePeriodEnds,
	}

	suggestedPhase := strategy.Evaluate(modelPlanStatus, timeline)
	suite.Nil(suggestedPhase)
}
