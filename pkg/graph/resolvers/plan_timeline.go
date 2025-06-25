package resolvers

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func UpdatePlanTimeline(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
) (*models.PlanTimeline, error) {
	// Get existing planTimeline
	existing, err := loaders.PlanTimeline.ByModelPlanID.Load(ctx, id)
	if err != nil {
		return nil, err
	}

	modelPlan, err := loaders.ModelPlan.GetByID.Load(ctx, existing.ModelPlanID)
	if err != nil {
		return nil, err
	}

	// Reset the previous suggested phase on the corresponding model plan
	// if any dates have changed
	datesChanged, err := extractPlanTimelineChangedDates(changes, existing)
	if err != nil {
		return nil, err
	}

	if len(datesChanged) > 0 {
		resetSuggestedPhaseChanges := map[string]interface{}{
			"previousSuggestedPhase": nil,
		}

		err = BaseStructPreUpdate(
			logger,
			modelPlan,
			resetSuggestedPhaseChanges,
			principal,
			store,
			true,
			true,
		)
		if err != nil {
			return nil, err
		}

		_, mpUpdateErr := store.ModelPlanUpdate(logger, modelPlan)
		if mpUpdateErr != nil {
			return nil, mpUpdateErr
		}
	}

	if emailService != nil &&
		emailTemplateService != nil &&
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		err2 := processPlanTimelineChangedDates(
			ctx,
			logger,
			store,
			principal,
			changes,
			existing,
			emailService,
			emailTemplateService,
			addressBook,
			modelPlan,
		)
		if err2 != nil {
			logger.Info("Failed to process changed dates",
				zap.String("modelPlanID", modelPlan.ID.String()),
				zap.Error(err2),
			)
		}
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.PlanTimeline, error) {
		updatedTimeline, err := store.PlanTimelineUpdate(tx, logger, existing)
		if err != nil {
			return nil, fmt.Errorf("failed to update timeline: %w", err)
		}

		return updatedTimeline, nil
	})
}

func PlanTimelineGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanTimeline, error) {
	return loaders.PlanTimeline.ByModelPlanID.Load(ctx, modelPlanID)
}
