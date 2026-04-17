package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO common milestones by a model plan ID using a data loader
// The modelPlanID is optional. It is used to provide meta data about the CommonMilestone in relation to a model plan (was it added or recommended?)
func MTOCommonMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID *uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.MTOCommonMilestone.ByModelPlanID.Load(ctx, key)
}

// MTOCommonMilestoneGetByIDLOADER returns a common milestone by its ID. Currently, it doesn't provide any contextual data.
func MTOCommonMilestoneGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.MTOCommonMilestone, error) {
	// Future Enhancement look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonMilestone.ByID.Load(ctx, id)
}

// MTOSuggestedMilestoneReasonGetByIDLOADER returns all suggestion reasons for a given mto_suggested_milestone ID.
func MTOSuggestedMilestoneReasonGetByIDLOADER(ctx context.Context, id uuid.UUID) ([]*models.MTOSuggestedMilestoneReason, error) {
	return loaders.MTOSuggestedMilestoneReason.ByMTOSuggestedMilestoneID.Load(ctx, id)
}

// CreateMTOCommonMilestone creates a common milestone in the library.
func CreateMTOCommonMilestone(
	store *storage.Store,
	name string,
	description string,
	categoryName string,
	subCategoryName *string,
	facilitatedByRole []models.MTOFacilitator,
	facilitatedByOther *string,
	mtoCommonSolutionKeys []models.MTOCommonSolutionKey,
	actorUserID uuid.UUID,
) (*models.MTOCommonMilestone, error) {
	return storage.MTOCommonMilestoneCreate(
		store,
		name,
		description,
		categoryName,
		subCategoryName,
		facilitatedByRole,
		facilitatedByOther,
		mtoCommonSolutionKeys,
		actorUserID,
	)
}

// UpdateMTOCommonMilestone updates a common milestone in the library.
func UpdateMTOCommonMilestone(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
	changes map[string]any,
	mtoCommonSolutionKeys []models.MTOCommonSolutionKey,
) (*models.MTOCommonMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingMilestones, err := storage.MTOCommonMilestoneGetByIDLoader(store, logger, []uuid.UUID{id})
	if err != nil {
		return nil, err
	}
	if len(existingMilestones) < 1 {
		return nil, fmt.Errorf("no common milestone found for id %s", id)
	}

	existingMilestone := existingMilestones[0]
	if err := BaseStructPreUpdate(logger, existingMilestone, changes, principal, store, true, false); err != nil {
		return nil, err
	}

	return storage.MTOCommonMilestoneUpdate(store, existingMilestone, mtoCommonSolutionKeys, principalAccount.ID)
}

// ArchiveMTOCommonMilestone marks a common milestone as archived.
func ArchiveMTOCommonMilestone(
	logger *zap.Logger,
	store *storage.Store,
	id uuid.UUID,
	actorUserID uuid.UUID,
) (*models.MTOCommonMilestone, error) {
	return storage.MTOCommonMilestoneArchive(store, logger, id, actorUserID)
}
