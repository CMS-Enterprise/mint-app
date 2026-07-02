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

// validateMandatoryTimelineNoApplicationDates ensures mandatory model types do not keep application open/close dates on the timeline.
func validateMandatoryTimelineNoApplicationDates(basics *models.PlanBasics, merged *models.PlanTimeline) error {
	if basics == nil || merged == nil {
		return nil
	}
	if !models.ModelTypeListIncludesMandatory(basics.ModelType) {
		return nil
	}
	if merged.ApplicationsStart != nil || merged.ApplicationsEnd != nil {
		return fmt.Errorf(
			"application period dates cannot be set when the model type is mandatory",
		)
	}
	return nil
}

func UpdatePlanTimeline(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) (*models.PlanTimeline, error) {
	// Get existing planTimeline
	existing, err := store.PlanTimelineGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	basics, err := PlanBasicsGetByModelPlanIDLOADER(ctx, existing.ModelPlanID)
	if err != nil {
		return nil, fmt.Errorf("unable to load plan basics for timeline update: %w", err)
	}

	previewTimeline := *existing
	if err := ApplyChanges(changes, &previewTimeline); err != nil {
		return nil, err
	}
	if err := validateMandatoryTimelineNoApplicationDates(basics, &previewTimeline); err != nil {
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

	plan, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.PlanTimeline, error) {

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

			_, mpUpdateErr := storage.ModelPlanUpdate(tx, logger, modelPlan)
			if mpUpdateErr != nil {
				return nil, mpUpdateErr
			}
		}

		err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
		if err != nil {
			return nil, err
		}

		updatedTimeline, err := store.PlanTimelineUpdate(tx, logger, existing)
		if err != nil {
			return nil, fmt.Errorf("failed to update timeline: %w", err)
		}

		return updatedTimeline, nil

	})

	if err != nil {
		return nil, err
	}

	// send email after all DB
	if emailService != nil &&
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		err2 := processPlanTimelineChangedDates(
			ctx,
			logger,
			store,
			principal,
			datesChanged,
			emailService,
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

	return plan, nil
}

func PlanTimelineGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanTimeline, error) {
	return loaders.PlanTimeline.ByModelPlanID.Load(ctx, modelPlanID)
}
