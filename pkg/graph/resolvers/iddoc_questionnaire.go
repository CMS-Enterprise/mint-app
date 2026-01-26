package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// IDDOCQuestionnaireUpdate updates an IDDOC questionnaire
// It looks to see if a user marked the section as complete, and if so it will update the completion metadata.
// If a user sets the section as not complete, it will clear that data.
func IDDOCQuestionnaireUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
) (*models.IDDOCQuestionnaire, error) {
	updatedQuestionnaire, err := sqlutils.WithTransaction[models.IDDOCQuestionnaire](
		store,
		func(tx *sqlx.Tx) (*models.IDDOCQuestionnaire, error) {
			// Get existing IDDOC questionnaire
			existing, err := storage.IDDOCQuestionnaireGetByID(tx, logger, id)
			if err != nil {
				return nil, err
			}

			// Variable to track whether or not this update mutation caused the IDDOC questionnaire
			// to go from some non-complete status to "Complete"
			iddocChangedToComplete := false

			// Check if the 'changes' map contains the 'isIDDOCQuestionnaireComplete' key and that the
			// 'isIDDOCQuestionnaireComplete' is different from the existing value
			if isIDDOCQuestionnaireComplete, ok := changes["isIDDOCQuestionnaireComplete"]; ok {
				isSettingToCompletePointer, ok := isIDDOCQuestionnaireComplete.(*bool)
				if !ok || isSettingToCompletePointer == nil {
					return nil, fmt.Errorf("unable to update IDDOC questionnaire, isIDDOCQuestionnaireComplete is not a bool")
				}
				isSettingToComplete := *isSettingToCompletePointer

				// Check if completion timestamp has been set or is the default value
				if existing.CompletedDts == nil && isSettingToComplete {
					iddocChangedToComplete = true
					// Only auto-set CompletedBy if it wasn't explicitly provided in changes
					if _, hasCompletedBy := changes["completedBy"]; !hasCompletedBy {
						existing.CompletedBy = &principal.Account().ID
					}
					existing.CompletedDts = helpers.PointerTo(time.Now().UTC())
				} else if !isSettingToComplete {
					// When setting to incomplete, clear both fields unless explicitly set
					if _, hasCompletedBy := changes["completedBy"]; !hasCompletedBy {
						existing.CompletedBy = nil
					}
					existing.CompletedDts = nil
				}

				// isIDDOCQuestionnaireComplete is now a database field, so keep it in changes map
				// to be persisted to the database
			}

			// Update the base task list section
			err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
			if err != nil {
				return nil, err
			}

			// Update the IDDOC questionnaire
			retQuestionnaire, err := storage.IDDOCQuestionnaireUpdate(tx, logger, existing)

			if iddocChangedToComplete {
				TrySendIDDOCQuestionnaireNotifications(
					ctx,
					existing,
					logger,
					emailService,
					emailAddressBook,
					principal,
					tx,
				)
			}

			return retQuestionnaire, err
		},
	)

	if err != nil {
		return nil, err
	}

	return updatedQuestionnaire, nil
}

// TrySendIDDOCQuestionnaireNotifications sends notifications when IDDOC questionnaire is marked complete
func TrySendIDDOCQuestionnaireNotifications(
	ctx context.Context,
	existing *models.IDDOCQuestionnaire,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	// TODO: Implement IDDOC questionnaire completion notifications
	// This should include:
	// 1. Get model plan by ID using ModelPlanGetByIDLOADER(ctx, existing.ModelPlanID)
	// 2. Get user notification preferences for IDDOC questionnaire marked complete
	// 3. Create activity for IDDOC questionnaire marked complete
	// 4. Send email notifications to MINT team
	// 5. Send email notifications to collaborators who opted in
	logger.Info("IDDOC questionnaire marked complete - notifications not yet implemented", zap.String("questionnaire_id", existing.ID.String()))
}

// IDDOCQuestionnaireGetByIDLoader calls a data loader to batch fetching an IDDOC questionnaire object by ID
func IDDOCQuestionnaireGetByIDLoader(ctx context.Context, id uuid.UUID) (*models.IDDOCQuestionnaire, error) {
	return loaders.IDDOCQuestionnaire.ByID.Load(ctx, id)
}

// IDDOCQuestionnaireGetByModelPlanIDLoader calls a data loader to batch fetching an IDDOC questionnaire object that corresponds to a model plan
func IDDOCQuestionnaireGetByModelPlanIDLoader(ctx context.Context, modelPlanID uuid.UUID) (*models.IDDOCQuestionnaire, error) {
	return loaders.IDDOCQuestionnaire.ByModelPlanID.Load(ctx, modelPlanID)
}
