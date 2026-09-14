package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// WaiversGetByModelPlanID returns all waivers associated with a model plan via dataloader
func WaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.Waiver, error) {
	return loaders.Waiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// UpdateSelectedWaivers upserts a waiver row for each selection in a single SQL statement.
// Creates the row if it does not exist, otherwise updates will_use_waiver and not_using_reason.
func UpdateSelectedWaivers(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	selections []*models.WaiverSelectionInput,
	principal authentication.Principal,
	store *storage.Store,
) ([]*models.Waiver, error) {
	actor := principal.Account().ID

	waivers := make([]*models.Waiver, 0, len(selections))
	for _, sel := range selections {
		w := models.NewWaiver(actor, modelPlanID, sel.CommonWaiverID)
		w.WillUseWaiver = &sel.WillUseWaiver
		w.NotUsingReason = sel.NotUsingReason
		w.ModifiedBy = &actor
		waivers = append(waivers, w)
	}

	return storage.WaiverUpsertCollection(store, logger, waivers)
}

// WaiverUpsert upserts a waiver row for the given model plan and common waiver,
// applying the provided changes. Creates the row if it does not yet exist.
func WaiverUpsert(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	commonWaiverID uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.Waiver, error) {
	waiver := models.NewWaiver(principal.Account().ID, modelPlanID, commonWaiverID)

	if err := BaseStructPreUpdate(logger, waiver, changes, principal, store, true, true); err != nil {
		return nil, err
	}

	return storage.WaiverUpsert(store, logger, waiver)
}

// SuggestedWaiversGetByModelPlanID returns suggested waivers for a model plan via dataloader
func SuggestedWaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.SuggestedWaiver, error) {
	return loaders.SuggestedWaiver.ByModelPlanID.Load(ctx, modelPlanID)
}
