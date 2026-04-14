package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// Plan task status updates: MODEL_PLAN, DATA_EXCHANGE, and MTO rows in plan_task are updated from
// multiple resolvers. This file is the single place for *when* each UpdatePlanTaskStatusOn* runs.
//
// Task status logic:
//
//	MODEL_PLAN
//    - IN_PROGRESS — first time any model plan section changes from READY to IN_PROGRESS.
//    - COMPLETE — model plan status changes to CLEARED.
//	DATA_EXCHANGE
//    - IN_PROGRESS — DEA status changes from READY to IN_PROGRESS.
//    - COMPLETE — DEA status changes to COMPLETE, or model status changes to CLEARED.
//	MTO
//    - IN_PROGRESS — MTO-related data is created or updated.
//    - COMPLETE — model plan status changes to ACTIVE.

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
	if err := updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyModelPlan, models.PlanTaskStatusComplete, principal, store); err != nil {
		return err
	}
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, models.PlanTaskStatusComplete, principal, store)
}

// UpdatePlanTaskStatusOnDataExchangeApproachStarted runs when DEA goes from READY to IN_PROGRESS.
func UpdatePlanTaskStatusOnDataExchangeApproachStarted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, models.PlanTaskStatusInProgress, principal, store)
}

// UpdatePlanTaskStatusOnDataExchangeApproachComplete runs when the data exchange approach status changes to COMPLETE.
func UpdatePlanTaskStatusOnDataExchangeApproachComplete(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyDataExchange, models.PlanTaskStatusComplete, principal, store)
}

// UpdatePlanTaskStatusOnMTOStarted runs when MTO-related data is created or updated.
func UpdatePlanTaskStatusOnMTOStarted(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, models.PlanTaskStatusInProgress, principal, store)
}

// UpdatePlanTaskStatusOnModelActive runs when model plan status changes to ACTIVE: MTO task completes.
func UpdatePlanTaskStatusOnModelActive(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
) error {
	return updatePlanTaskStatusByKey(np, logger, modelPlanID, models.PlanTaskKeyMto, models.PlanTaskStatusComplete, principal, store)
}
