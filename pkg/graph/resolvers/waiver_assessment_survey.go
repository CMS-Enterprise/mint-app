package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// WaiverAssessmentSurveyGetByModelPlanID returns the waiver assessment survey associated with a model plan via dataloader
func WaiverAssessmentSurveyGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return loaders.WaiverAssessmentSurvey.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverAssessmentSurveyGetByID returns a waiver assessment survey by ID
func WaiverAssessmentSurveyGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return storage.WaiverAssessmentSurveyGetByID(store, logger, id)
}

// WaiverAssessmentSurveyUpdate applies changes to a waiver assessment survey and persists them.
// The survey write and plan task status update are wrapped in a single transaction so they
// cannot diverge if one succeeds and the other fails.
func WaiverAssessmentSurveyUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
) (*models.WaiverAssessmentSurvey, error) {
	return sqlutils.WithTransaction[models.WaiverAssessmentSurvey](
		store,
		func(tx *sqlx.Tx) (*models.WaiverAssessmentSurvey, error) {
			existing, err := storage.WaiverAssessmentSurveyGetByID(tx, logger, id)
			if err != nil {
				return nil, err
			}

			// Auto-transition from READY to IN_PROGRESS on first save, matching the
			// DEA pattern. If the caller also sends an explicit status it will override
			// this via ApplyChanges below.
			if existing.Status == models.WaiverAssessmentSurveyStatusReady {
				existing.Status = models.WaiverAssessmentSurveyStatusInProgress
			}

			if err := BaseStructPreUpdate(logger, existing, changes, principal, store, true, true); err != nil {
				return nil, err
			}

			updated, err := storage.WaiverAssessmentSurveyUpdate(tx, logger, existing)
			if err != nil {
				return nil, err
			}

			if err := UpdatePlanTaskStatusOnWaiverAssessmentStarted(tx, logger, updated.ModelPlanID, principal, store); err != nil {
				return nil, err
			}

			if err := RecalculateSuggestedWaivers(tx, logger, updated, principal); err != nil {
				return nil, err
			}

			if updated.Status == models.WaiverAssessmentSurveyStatusComplete {
				TrySendWaiverAssessmentSurveyNotifications(ctx, updated, logger, emailService, emailAddressBook, principal, tx)
			}

			return updated, nil
		},
	)
}

// WaiversGetByModelPlanID returns all waivers associated with a model plan via dataloader
func WaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.Waiver, error) {
	return loaders.Waiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverGetByID returns a waiver by ID
func WaiverGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.Waiver, error) {
	return storage.WaiverGetByID(store, logger, id)
}

// WaiverUpdate applies changes to a waiver row and persists them
func WaiverUpdate(
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.Waiver, error) {
	existing, err := storage.WaiverGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	if err := BaseStructPreUpdate(logger, existing, changes, principal, store, true, true); err != nil {
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
