package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// Plan task status updates: MODEL_PLAN, DATA_EXCHANGE, and MTO rows in plan_task are updated from
// multiple resolvers. This file is the source of truth for *when* each UpdatePlanTaskStatusOn* runs.
//
// Task status logic:
//
//	MODEL_PLAN
//    - IN_PROGRESS — any model plan section is IN_PROGRESS.
//    - COMPLETE — model plan status is CLEARED.
//	DATA_EXCHANGE
//    - IN_PROGRESS — DEA status is IN_PROGRESS.
//    - COMPLETE — DEA status is COMPLETE, or model status is CLEARED.
//	MTO
//    - IN_PROGRESS — MTO-related data is created or updated.
//    - COMPLETE — model plan status is ACTIVE.

// UpdatePlanTaskStatusOnModelPlanStarted runs when a model plan section goes from READY to IN_PROGRESS.
func UpdatePlanTaskStatusOnModelPlanStarted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, models.PlanTaskStatusInProgress, principal, store)
}

// UpdatePlanTaskStatusOnModelCleared runs when model plan status becomes CLEARED: MODEL_PLAN and DATA_EXCHANGE tasks complete.
func UpdatePlanTaskStatusOnModelCleared(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	modelPlanStatus, err := calculateModelPlanTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	if err := updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, modelPlanStatus, principal, store); err != nil {
		return err
	}

	dataExchangeStatus, err := calculateDataExchangeTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeStatus, principal, store)
}

// UpdatePlanTaskStatusOnModelNoLongerCleared runs when model plan status regresses from CLEARED:
// MODEL_PLAN and DATA_EXCHANGE tasks are recalculated from current section/DEA/model status.
func UpdatePlanTaskStatusOnModelNoLongerCleared(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	modelPlanStatus, err := calculateModelPlanTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	if err := updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, modelPlanStatus, principal, store); err != nil {
		return err
	}

	dataExchangeStatus, err := calculateDataExchangeTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeStatus, principal, store)
}

func calculateModelPlanTaskStatus(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskStatus, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusCleared {
		return models.PlanTaskStatusComplete, nil
	}

	basics, err := storage.PlanBasicsGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(basics) > 0 && basics[0] != nil && basics[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	timeline, err := storage.PlanTimelineGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(timeline) > 0 && timeline[0] != nil && timeline[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID
	paramTableJSON, jsonErr := loaders.KeyArgsArray{key}.ToJSONArray()
	if jsonErr != nil {
		return "", *jsonErr
	}

	generalCharacteristics, err := store.PlanGeneralCharacteristicsGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(generalCharacteristics) > 0 && generalCharacteristics[0] != nil && generalCharacteristics[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	beneficiaries, err := store.PlanBeneficiariesGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(beneficiaries) > 0 && beneficiaries[0] != nil && beneficiaries[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	participantsAndProviders, err := store.PlanParticipantsAndProvidersGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(participantsAndProviders) > 0 && participantsAndProviders[0] != nil && participantsAndProviders[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	opsEvalAndLearning, err := store.PlanOpsEvalAndLearningGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(opsEvalAndLearning) > 0 && opsEvalAndLearning[0] != nil && opsEvalAndLearning[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	payments, err := store.PlanPaymentsGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(payments) > 0 && payments[0] != nil && payments[0].Status != models.TaskReady {
		return models.PlanTaskStatusInProgress, nil
	}

	return models.PlanTaskStatusToDo, nil
}

// UpdatePlanTaskStatusOnDataExchangeApproachStarted runs when DEA status changes to IN_PROGRESS.
func UpdatePlanTaskStatusOnDataExchangeApproachStarted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	dataExchangeStatus, err := calculateDataExchangeTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeStatus, principal, store)
}

// UpdatePlanTaskStatusOnDataExchangeApproachComplete runs when the data exchange approach status changes to COMPLETE.
func UpdatePlanTaskStatusOnDataExchangeApproachComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	dataExchangeStatus, err := calculateDataExchangeTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeStatus, principal, store)
}

// UpdatePlanTaskStatusOnDataExchangeApproachNoLongerComplete runs when DEA status regresses from COMPLETE:
// DATA_EXCHANGE task is recalculated from current DEA/model status.
func UpdatePlanTaskStatusOnDataExchangeApproachNoLongerComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	dataExchangeStatus, err := calculateDataExchangeTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeStatus, principal, store)
}

func calculateDataExchangeTaskStatus(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskStatus, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusCleared {
		return models.PlanTaskStatusComplete, nil
	}

	deas, err := storage.PlanDataExchangeApproachGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(deas) == 0 || deas[0] == nil {
		return models.PlanTaskStatusToDo, nil
	}

	switch deas[0].Status {
	case models.DataExchangeApproachStatusComplete:
		return models.PlanTaskStatusComplete, nil
	case models.DataExchangeApproachStatusInProgress:
		return models.PlanTaskStatusInProgress, nil
	default:
		return models.PlanTaskStatusToDo, nil
	}
}

// UpdatePlanTaskStatusOnMTOStarted runs when MTO-related data is created or updated.
func UpdatePlanTaskStatusOnMTOStarted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	mtoStatus, err := calculateMTOTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, mtoStatus, principal, store)
}

// UpdatePlanTaskStatusOnModelActive runs when model plan status changes to ACTIVE: MTO task completes.
func UpdatePlanTaskStatusOnModelActive(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	mtoStatus, err := calculateMTOTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, mtoStatus, principal, store)
}

// UpdatePlanTaskStatusOnMTODataDeleted recalculates and applies MTO task status when MTO data is deleted.
func UpdatePlanTaskStatusOnMTODataDeleted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	mtoStatus, err := calculateMTOTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, mtoStatus, principal, store)
}

// UpdatePlanTaskStatusOnModelNoLongerActive runs when model plan status regresses from ACTIVE.
func UpdatePlanTaskStatusOnModelNoLongerActive(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	mtoStatus, err := calculateMTOTaskStatus(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, mtoStatus, principal, store)
}

func calculateMTOTaskStatus(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskStatus, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusActive {
		return models.PlanTaskStatusComplete, nil
	}

	mtoCategories, err := storage.MTOCategoryGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoCategories) > 0 {
		return models.PlanTaskStatusInProgress, nil
	}

	mtoMilestones, err := storage.MTOMilestoneGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoMilestones) > 0 {
		return models.PlanTaskStatusInProgress, nil
	}

	mtoSolutions, err := storage.MTOSolutionGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoSolutions) > 0 {
		return models.PlanTaskStatusInProgress, nil
	}

	return models.PlanTaskStatusToDo, nil
}
