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
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseTaskListSectionPreUpdate(logger *zap.Logger, tls models.IBaseTaskListSection, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
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
		modelPlanID := tls.GetModelPlanID()
		err = UpdatePlanTaskStateOnModelPlanStarted(context.Background(), store, logger, modelPlanID, principal, store)
		if err != nil {
			return err
		}
	}

	return nil

}

// BaseTaskListSectionAfterUpdate recalculates the PREPARE_FOR_CLEARANCE plan task after a section write.
func BaseTaskListSectionAfterUpdate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	return UpdatePlanTaskStateOnPrepareForClearanceSync(
		ctx,
		np,
		logger,
		modelPlanID,
		principal,
		store,
		emailService,
		addressBook,
	)
}
