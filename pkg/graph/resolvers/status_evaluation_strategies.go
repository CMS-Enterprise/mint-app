package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/graph/model"

	"github.com/cmsgov/mint-app/pkg/shared/utilitytime"

	"github.com/cmsgov/mint-app/pkg/models"
)

// GetAllStatusEvaluationStrategies returns all status evaluation strategies.
// Strategies are typically evaluated in order they are returned, so it is important
// to sort them in reverse chronological order so that the suggested status is the
// most chronologically advanced possible suggestion.
func GetAllStatusEvaluationStrategies() []StatusEvaluationStrategy {
	return []StatusEvaluationStrategy{
		&EndedStrategy{},
		&ActiveStrategy{},
		&AnnounceStrategy{},
		&ClearanceEndStrategy{},
		&ClearanceStartStrategy{},
		&ICIPCompleteStrategy{},
	}
}

// StatusEvaluationStrategy is an interface for evaluating the status of a model plan
type StatusEvaluationStrategy interface {
	Evaluate(
		modelPlanStatus models.ModelStatus,
		planBasics *models.PlanBasics,
	) *model.PhaseSuggestion
}

// ICIPCompleteStrategy is a strategy for evaluating the ICIP complete status of a model plan
type ICIPCompleteStrategy struct{}

// Evaluate returns the models.ModelStatusIcipComplete status if the model plan
// status is not "ICIP complete" and the ICIP complete date has passed
func (s *ICIPCompleteStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusIcipComplete) &&
		!utilitytime.IsTimeNilOrZero(planBasics.CompleteICIP) &&
		planBasics.CompleteICIP.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase:             models.ModelPhaseIcipComplete,
			SuggestedStatuses: []models.ModelStatus{models.ModelStatusIcipComplete},
		}
	}
	return nil
}

// ClearanceStartStrategy is a strategy for evaluating the clearance start status of a model plan
type ClearanceStartStrategy struct{}

// Evaluate returns the chronologically earliest clearance status
// (models.ModelStatusInternalCmmiClearance) if the model plan status is not
// "Plan Complete" and the clearance start date has passed
func (s *ClearanceStartStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusInternalCmmiClearance) &&
		!utilitytime.IsTimeNilOrZero(planBasics.ClearanceStarts) &&
		planBasics.ClearanceStarts.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase: models.ModelPhaseInClearance,
			SuggestedStatuses: []models.ModelStatus{
				models.ModelStatusInternalCmmiClearance,
				models.ModelStatusCmsClearance,
				models.ModelStatusHhsClearance,
				models.ModelStatusOmbAsrfClearance,
			},
		}
	}
	return nil
}

// ClearanceEndStrategy is a strategy for evaluating the clearance end status of a model plan
type ClearanceEndStrategy struct{}

// Evaluate returns the models.ModelStatusCleared status if the model plan status
// is not Cleared and the clearance end date has passed
func (s *ClearanceEndStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusCleared) &&
		!utilitytime.IsTimeNilOrZero(planBasics.ClearanceEnds) &&
		planBasics.ClearanceEnds.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase:             models.ModelPhaseCleared,
			SuggestedStatuses: []models.ModelStatus{models.ModelStatusCleared},
		}
	}
	return nil
}

// AnnounceStrategy is a strategy for evaluating the announcement status of a model plan
type AnnounceStrategy struct{}

// Evaluate returns the models.ModelStatusAnnounced status if the model plan
// status is not Announced and the announcement date has passed
func (s *AnnounceStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusAnnounced) &&
		!utilitytime.IsTimeNilOrZero(planBasics.Announced) &&
		planBasics.Announced.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase:             models.ModelPhaseAnnounced,
			SuggestedStatuses: []models.ModelStatus{models.ModelStatusAnnounced},
		}
	}
	return nil
}

// ActiveStrategy is a strategy for evaluating the active status of a model plan
type ActiveStrategy struct{}

// Evaluate returns the models.ModelStatusActive status if the model plan status
// is not Active and the performance period start date has passed
func (s *ActiveStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusActive) &&
		!utilitytime.IsTimeNilOrZero(planBasics.PerformancePeriodStarts) &&
		planBasics.PerformancePeriodStarts.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase:             models.ModelPhaseActive,
			SuggestedStatuses: []models.ModelStatus{models.ModelStatusActive},
		}
	}
	return nil
}

// EndedStrategy is a strategy for evaluating the ended status of a model plan
type EndedStrategy struct{}

// Evaluate returns the models.ModelStatusEnded status if the model plan status
// is not already "Ended" and the performance period end date has passed
func (s *EndedStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) *model.PhaseSuggestion {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusEnded) &&
		!utilitytime.IsTimeNilOrZero(planBasics.PerformancePeriodEnds) &&
		planBasics.PerformancePeriodEnds.Before(time.Now()) {
		return &model.PhaseSuggestion{
			Phase:             models.ModelPhaseEnded,
			SuggestedStatuses: []models.ModelStatus{models.ModelStatusEnded},
		}
	}
	return nil
}
