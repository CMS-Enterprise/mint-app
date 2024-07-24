package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

// GetAllStatusEvaluationStrategies returns all status evaluation strategies
func GetAllStatusEvaluationStrategies() []StatusEvaluationStrategy {
	return []StatusEvaluationStrategy{
		&ICIPCompleteStrategy{},
		&ClearanceStartStrategy{},
		&ClearanceEndStrategy{},
		&AnnounceStrategy{},
		&ActiveStrategy{},
		&EndedStrategy{},
	}
}

// StatusEvaluationStrategy is an interface for evaluating the status of a model plan
type StatusEvaluationStrategy interface {
	Evaluate(
		modelPlanStatus models.ModelStatus,
		planBasics *models.PlanBasics,
	) (models.ModelStatus, bool)
}

// ICIPCompleteStrategy is a strategy for evaluating the ICIP complete status of a model plan
type ICIPCompleteStrategy struct{}

// Evaluate returns the models.ModelStatusIcipComplete status if the model plan
// status is not "ICIP complete" and the ICIP complete date has passed
func (s *ICIPCompleteStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusIcipComplete) &&
		planBasics.CompleteICIP != nil &&
		planBasics.CompleteICIP.Before(time.Now()) {
		return models.ModelStatusIcipComplete, true
	}
	return "", false
}

// ClearanceStartStrategy is a strategy for evaluating the clearance start status of a model plan
type ClearanceStartStrategy struct{}

// Evaluate returns the chronologically earliest clearance status
// (models.ModelStatusInternalCmmiClearance) if the model plan status is not
// "Plan Complete" and the clearance start date has passed
func (s *ClearanceStartStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusInternalCmmiClearance) &&
		planBasics.ClearanceStarts != nil &&
		planBasics.ClearanceStarts.Before(time.Now()) {
		return models.ModelStatusInternalCmmiClearance, true
	}
	return "", false
}

// ClearanceEndStrategy is a strategy for evaluating the clearance end status of a model plan
type ClearanceEndStrategy struct{}

// Evaluate returns the models.ModelStatusCleared status if the model plan status
// is not Cleared and the clearance end date has passed
func (s *ClearanceEndStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusCleared) &&
		planBasics.ClearanceEnds != nil &&
		planBasics.ClearanceEnds.Before(time.Now()) {
		return models.ModelStatusCleared, true
	}
	return "", false
}

// AnnounceStrategy is a strategy for evaluating the announcement status of a model plan
type AnnounceStrategy struct{}

// Evaluate returns the models.ModelStatusAnnounced status if the model plan
// status is not Announced and the announcement date has passed
func (s *AnnounceStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusAnnounced) &&
		planBasics.Announced != nil &&
		planBasics.Announced.Before(time.Now()) {
		return models.ModelStatusAnnounced, true
	}
	return "", false
}

// ActiveStrategy is a strategy for evaluating the active status of a model plan
type ActiveStrategy struct{}

// Evaluate returns the models.ModelStatusActive status if the model plan status
// is not Active and the performance period start date has passed
func (s *ActiveStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusActive) &&
		planBasics.PerformancePeriodStarts != nil &&
		planBasics.PerformancePeriodStarts.Before(time.Now()) {
		return models.ModelStatusActive, true
	}
	return "", false
}

// EndedStrategy is a strategy for evaluating the ended status of a model plan
type EndedStrategy struct{}

// Evaluate returns the models.ModelStatusEnded status if the model plan status
// is not already "Ended" and the performance period end date has passed
func (s *EndedStrategy) Evaluate(
	modelPlanStatus models.ModelStatus,
	planBasics *models.PlanBasics,
) (models.ModelStatus, bool) {
	if models.GetModelStatusChronologicalIndex(modelPlanStatus) <
		models.GetModelStatusChronologicalIndex(models.ModelStatusEnded) &&
		planBasics.PerformancePeriodEnds != nil &&
		planBasics.PerformancePeriodEnds.Before(time.Now()) {
		return models.ModelStatusEnded, true
	}
	return "", false
}
