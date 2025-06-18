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

func UpdateTimeline(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
) (*models.Timeline, error) {
	// Get existing timeline
	existing, err := store.TimelineGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(store, logger, existing.ModelPlanID)
	if err != nil {
		return nil, err
	}

	// Reset the previous suggested phase on the corresponding model plan
	// if any dates have changed
	datesChanged, err := extractTimelineChangedDates(changes, existing)
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
		err2 := processTimelineChangedDates(
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

	retTimeline, err := store.TimelineUpdate(logger, existing)
	return retTimeline, err
}

func ModelPlanUpcomingTimelineDate(ctx context.Context, modelPlanID uuid.UUID) (*time.Time, error) {
	timeline, err := loaders.Timeline.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	if timeline == nil {
		return nil, nil // No timeline found for the given model plan ID
	}

	now := time.Now()
	var nearest *time.Time

	dateFields := []*time.Time{
		timeline.CompleteICIP,
		timeline.ClearanceStarts,
		timeline.ClearanceEnds,
		timeline.Announced,
		timeline.ApplicationsStart,
		timeline.ApplicationsEnd,
		timeline.PerformancePeriodStarts,
		timeline.PerformancePeriodEnds,
		timeline.WrapUpEnds,
	}

	for _, dt := range dateFields {
		if dt != nil && dt.After(now) {
			if nearest == nil || dt.Before(*nearest) {
				nearest = dt
			}
		}
	}

	return nearest, nil
}

func TimelineGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.Timeline, error) {
	return loaders.Timeline.ByModelPlanID.Load(ctx, modelPlanID)
}
