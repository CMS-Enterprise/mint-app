package resolvers

import (
	"context"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

type UpcomingTimelineDate struct {
	Date      *time.Time
	DateField string
}

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
	existing, err := store.PlanTimelineGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(store, logger, existing.ModelPlanID)
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

	retPlanTimeline, err := store.PlanTimelineUpdate(logger, existing)
	return retPlanTimeline, err
}

func ModelPlanUpcomingPlanTimelineDate(ctx context.Context, modelPlanID uuid.UUID) (*UpcomingTimelineDate, error) {
	planTimeline, err := loaders.PlanTimeline.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	if planTimeline == nil {
		return nil, nil // No planTimeline found for the given model plan ID
	}

	nearest, nearestField, err := getUpcomingPlanTimelineDate(planTimeline)

	if err != nil {
		return nil, err
	}

	if nearest == nil || nearestField == "" {
		return nil, nil
	}

	return &UpcomingTimelineDate{
		Date:      nearest,
		DateField: nearestField,
	}, nil
}

func PlanTimelineGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanTimeline, error) {
	return loaders.PlanTimeline.ByModelPlanID.Load(ctx, modelPlanID)
}
