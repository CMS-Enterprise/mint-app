package resolvers

import (
	"context"
	"fmt"
	"sort"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CustomTimelineDateGetByIDLOADER returns a custom timeline date by its provided ID.
func CustomTimelineDateGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.CustomTimelineDate, error) {
	return loaders.CustomTimelineDate.ByID.Load(ctx, id)
}

// CustomTimelineDateGetByModelPlanIDLOADER returns custom timeline dates by their provided model plan ID.
func CustomTimelineDateGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.CustomTimelineDate, error) {
	customTimelineDates, err := loaders.CustomTimelineDate.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	sort.SliceStable(customTimelineDates, func(i, j int) bool {
		// in order to always get a deterministic return, we first order by the start date, and if those are equal, then we fall back to ordering by which was created first
		if customTimelineDates[i].StartDate.Equal(customTimelineDates[j].StartDate) {
			return customTimelineDates[i].CreatedDts.Before(customTimelineDates[j].CreatedDts)
		}
		return customTimelineDates[i].StartDate.Before(customTimelineDates[j].StartDate)
	})

	return customTimelineDates, nil
}

// DeleteCustomTimelineDate deletes a custom timeline date.
func DeleteCustomTimelineDate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
) (*models.CustomTimelineDate, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing, err := loaders.CustomTimelineDate.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("error fetching custom timeline date during deletion: %w", err)
	}

	if existing == nil {
		return nil, fmt.Errorf("custom timeline date with id %s not found", id)
	}

	if err := BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
		return nil, fmt.Errorf("error deleting custom timeline date. user doesn't have permissions: %w", err)
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.CustomTimelineDate, error) {
		deletedCustomTimelineDate, err := storage.CustomTimelineDateDelete(tx, principalAccount.ID, id)
		if err != nil {
			return nil, fmt.Errorf("unable to delete custom timeline date: %w", err)
		}

		return deletedCustomTimelineDate, nil
	})
}
