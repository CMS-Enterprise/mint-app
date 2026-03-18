package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseTaskListSectionPreUpdate(logger *zap.Logger, tls models.IBaseTaskListSection, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	// section := tls.GetBaseTaskListSection()
	oldStatus := tls.GetStatus()

	err := BaseStructPreUpdate(logger, tls, changes, principal, store, true, true)
	if err != nil {
		return err
	}

	err = tls.CalcStatus(oldStatus)
	if err != nil {
		return err
	}

	// MODEL_PLAN task progression: if any section is first edited, mark the MODEL_PLAN task IN_PROGRESS
	if oldStatus == models.TaskReady && tls.GetStatus() == models.TaskInProgress {
		err = updatePlanTaskStatusByKey(store, logger, tls.GetModelPlanID(), models.PlanTaskKeyModelPlan, models.PlanTaskStatusInProgress, principal, store)
		if err != nil {
			return err
		}
	}

	return nil

}
