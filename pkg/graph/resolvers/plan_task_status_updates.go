package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// Plan task state updates: MODEL_PLAN, DATA_EXCHANGE, and MTO rows in plan_task are updated from
// multiple resolvers. This file is the source of truth for *when* each UpdatePlanTaskStateOn* runs.
//
// Not every PlanTaskKey is calculated here. Some (e.g. TWO_PAGER) have no calculated state and are
// only ever changed by direct user action, via PlanTaskMarkComplete (plan_task.go) and the
// markPlanTaskComplete mutation. Whether a key is calculated (belongs in this file) or manually
// markable (goes through PlanTaskMarkComplete instead) is decided by
// models.PlanTaskKey.IsManuallyMarkable (pkg/models/plan_task.go) — add new calculated keys to a
// function here, and new manually-markable keys to that allow-list, not both.
//
// Task state logic:
//
//	MODEL_PLAN
//    - IN_PROGRESS — any model plan section status is not READY.
//    - COMPLETE — model plan status is CLEARED.
//	DATA_EXCHANGE
//    - IN_PROGRESS — DEA status is IN_PROGRESS.
//    - COMPLETE — DEA status is COMPLETE, or model status is CLEARED.
//	MTO
//    - IN_PROGRESS — MTO-related data is created or updated.
//    - COMPLETE — model plan status is ACTIVE.

// UpdatePlanTaskStateOnModelPlanStarted runs when a model plan section goes from READY to IN_PROGRESS.
func UpdatePlanTaskStateOnModelPlanStarted(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	_, err := updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyModelPlan, models.PlanTaskStateInProgress, principal, principal.Account().ID, store, nil, email.AddressBook{})
	return err
}

// UpdatePlanTaskStateOnModelCleared runs when model plan status becomes CLEARED: MODEL_PLAN and DATA_EXCHANGE tasks complete.
func UpdatePlanTaskStateOnModelCleared(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	modelPlanState, err := calculateModelPlanTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	if _, err := updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyModelPlan, modelPlanState, principal, principal.Account().ID, store, emailService, addressBook); err != nil {
		return err
	}

	dataExchangeState, err := calculateDataExchangeTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

// UpdatePlanTaskStateOnModelNoLongerCleared runs when model plan status regresses from CLEARED:
// MODEL_PLAN and DATA_EXCHANGE tasks are recalculated from current section/DEA/model status.
func UpdatePlanTaskStateOnModelNoLongerCleared(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	modelPlanState, err := calculateModelPlanTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}
	if _, err := updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyModelPlan, modelPlanState, principal, principal.Account().ID, store, emailService, addressBook); err != nil {
		return err
	}

	dataExchangeState, err := calculateDataExchangeTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

func calculateModelPlanTaskState(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskState, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusCleared {
		return models.PlanTaskStateComplete, nil
	}

	basics, err := storage.PlanBasicsGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(basics) > 0 && basics[0] != nil && basics[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
	}

	timeline, err := storage.PlanTimelineGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(timeline) > 0 && timeline[0] != nil && timeline[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
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
		return models.PlanTaskStateInProgress, nil
	}

	beneficiaries, err := store.PlanBeneficiariesGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(beneficiaries) > 0 && beneficiaries[0] != nil && beneficiaries[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
	}

	participantsAndProviders, err := store.PlanParticipantsAndProvidersGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(participantsAndProviders) > 0 && participantsAndProviders[0] != nil && participantsAndProviders[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
	}

	opsEvalAndLearning, err := store.PlanOpsEvalAndLearningGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(opsEvalAndLearning) > 0 && opsEvalAndLearning[0] != nil && opsEvalAndLearning[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
	}

	payments, err := store.PlanPaymentsGetByModelPlanIDLOADER(logger, paramTableJSON)
	if err != nil {
		return "", err
	}
	if len(payments) > 0 && payments[0] != nil && payments[0].Status != models.TaskReady {
		return models.PlanTaskStateInProgress, nil
	}

	return models.PlanTaskStateToDo, nil
}

// UpdatePlanTaskStateOnDataExchangeApproachStarted runs when DEA status changes to IN_PROGRESS.
func UpdatePlanTaskStateOnDataExchangeApproachStarted(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	dataExchangeState, err := calculateDataExchangeTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeState, principal, principal.Account().ID, store, nil, email.AddressBook{})
	return err
}

// UpdatePlanTaskStateOnDataExchangeApproachComplete runs when the data exchange approach status changes to COMPLETE.
func UpdatePlanTaskStateOnDataExchangeApproachComplete(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	dataExchangeState, err := calculateDataExchangeTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

// UpdatePlanTaskStateOnDataExchangeApproachNoLongerComplete runs when DEA status regresses from COMPLETE:
// DATA_EXCHANGE task is recalculated from current DEA/model status.
func UpdatePlanTaskStateOnDataExchangeApproachNoLongerComplete(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	dataExchangeState, err := calculateDataExchangeTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyDataExchange, dataExchangeState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

func calculateDataExchangeTaskState(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskState, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusCleared {
		return models.PlanTaskStateComplete, nil
	}

	deas, err := storage.PlanDataExchangeApproachGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(deas) == 0 || deas[0] == nil {
		return models.PlanTaskStateToDo, nil
	}

	switch deas[0].Status {
	case models.DataExchangeApproachStatusComplete:
		return models.PlanTaskStateComplete, nil
	case models.DataExchangeApproachStatusInProgress:
		return models.PlanTaskStateInProgress, nil
	default:
		return models.PlanTaskStateToDo, nil
	}
}

// UpdatePlanTaskStateOnMTOStarted runs when MTO-related data is created or updated.
func UpdatePlanTaskStateOnMTOStarted(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	mtoState, err := calculateMTOTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyMto, mtoState, principal, principal.Account().ID, store, nil, email.AddressBook{})
	return err
}

// UpdatePlanTaskStateOnModelActive runs when model plan status changes to ACTIVE: MTO task completes.
func UpdatePlanTaskStateOnModelActive(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	mtoState, err := calculateMTOTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyMto, mtoState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

// UpdatePlanTaskStateOnMTODataDeleted recalculates and applies MTO task status when MTO data is deleted.
func UpdatePlanTaskStateOnMTODataDeleted(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	mtoState, err := calculateMTOTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyMto, mtoState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

// UpdatePlanTaskStateOnModelNoLongerActive runs when model plan status regresses from ACTIVE.
func UpdatePlanTaskStateOnModelNoLongerActive(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	mtoState, err := calculateMTOTaskState(np, logger, modelPlanID, store)
	if err != nil {
		return err
	}

	_, err = updatePlanTaskStateByKey(ctx, np, logger, modelPlanID, models.PlanTaskKeyMto, mtoState, principal, principal.Account().ID, store, emailService, addressBook)
	return err
}

func calculateMTOTaskState(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	store *storage.Store,
) (models.PlanTaskState, error) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		return "", err
	}

	if modelPlan.Status == models.ModelStatusActive {
		return models.PlanTaskStateComplete, nil
	}

	mtoCategories, err := storage.MTOCategoryGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoCategories) > 0 {
		return models.PlanTaskStateInProgress, nil
	}

	mtoMilestones, err := storage.MTOMilestoneGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoMilestones) > 0 {
		return models.PlanTaskStateInProgress, nil
	}

	mtoSolutions, err := storage.MTOSolutionGetByModelPlanIDLoader(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return "", err
	}
	if len(mtoSolutions) > 0 {
		return models.PlanTaskStateInProgress, nil
	}

	return models.PlanTaskStateToDo, nil
}
