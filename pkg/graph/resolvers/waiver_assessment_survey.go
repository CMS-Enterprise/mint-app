package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// WaiverAssessmentSurveyGetByModelPlanID returns the waiver assessment survey associated with a model plan via dataloader
func WaiverAssessmentSurveyGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return loaders.WaiverAssessmentSurvey.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverAssessmentSurveyGetByID returns a waiver assessment survey by ID using the store from the loaders
func WaiverAssessmentSurveyGetByID(ctx context.Context, id uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	logger := appcontext.ZLogger(ctx)
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	return storage.WaiverAssessmentSurveyGetByID(allLoaders.DataReader.Store, logger, id)
}

// WaiverAssessmentSurveyUpdate applies changes to a waiver assessment survey and persists them
func WaiverAssessmentSurveyUpdate(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.WaiverAssessmentSurvey, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	store := allLoaders.DataReader.Store

	existing, err := storage.WaiverAssessmentSurveyGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	if err := BaseStructPreUpdate(logger, existing, changes, principal, store, true, true); err != nil {
		return nil, err
	}

	updated, err := storage.WaiverAssessmentSurveyUpdate(store, logger, existing)
	if err != nil {
		return nil, err
	}

	if err := UpdatePlanTaskStatusOnWaiverAssessmentStarted(store, logger, updated.ModelPlanID, principal, store); err != nil {
		return nil, err
	}

	return updated, nil
}

// WaiversGetByModelPlanID returns all waivers associated with a model plan via dataloader
func WaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.Waiver, error) {
	return loaders.Waiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverGetByID returns a waiver by ID via the store
func WaiverGetByID(ctx context.Context, id uuid.UUID) (*models.Waiver, error) {
	logger := appcontext.ZLogger(ctx)
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	return storage.WaiverGetByID(allLoaders.DataReader.Store, logger, id)
}

// WaiverUpdate applies changes to a waiver row and persists them
func WaiverUpdate(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.Waiver, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	store := allLoaders.DataReader.Store

	existing, err := storage.WaiverGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	if err := BaseStructPreUpdate(logger, existing, changes, principal, store, true, false); err != nil {
		return nil, err
	}

	return storage.WaiverUpdate(store, logger, existing)
}

// SuggestedWaiversGetByModelPlanID returns suggested waivers for a model plan via dataloader
func SuggestedWaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.SuggestedWaiver, error) {
	return loaders.SuggestedWaiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// CommonWaiverGetByID returns a common waiver by ID via dataloader
func CommonWaiverGetByID(ctx context.Context, id uuid.UUID) (*models.CommonWaiver, error) {
	return loaders.CommonWaiver.ByID.Load(ctx, id)
}
