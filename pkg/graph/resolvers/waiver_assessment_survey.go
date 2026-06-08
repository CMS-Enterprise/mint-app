package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

/*
TODO: Seed suggested waivers should be moved out of this package to the seeding package.
*/

// SeedSuggestedWaivers creates a suggested_waiver row for every common_waiver, giving a
// new model plan the full set of suggestions before any survey answers are recorded.
func SeedSuggestedWaivers(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
) error {
	// we don't provide model plan id here because we are just looking for the entire list
	commonWaivers, err := GetAllCommonWaiversByModelPlanID(ctx, nil)
	if err != nil {
		return err
	}

	for _, cw := range commonWaivers {
		sw := models.NewSuggestedWaiver(principal.Account().ID, modelPlanID, cw.ID)
		if _, err := storage.SuggestedWaiverCreate(np, logger, sw); err != nil {
			return err
		}
	}
	return nil
}

// RecalculateSuggestedWaivers replaces all suggested_waiver rows for the model plan based on
// the current survey answers. A common waiver is included when:
//   - its survey_question_field is nil (no mapping yet → always suggest), or
//   - the corresponding survey field is nil (unanswered → still suggest), or
//   - the corresponding survey field is true (model needs this waiver type).
//
// When real waiver→question mappings are available, populate common_waiver.survey_question_field
// via a migration — no Go code changes needed.
func RecalculateSuggestedWaivers(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	survey *models.WaiverAssessmentSurvey,
	principal authentication.Principal,
) error {
	if _, err := storage.SuggestedWaiverDeleteAllByModelPlanID(np, logger, survey.ModelPlanID); err != nil {
		return err
	}

	// we don't provide model plan id here because we are just looking for the entire list
	commonWaivers, err := GetAllCommonWaiversByModelPlanID(ctx, nil)
	if err != nil {
		return err
	}

	for _, cw := range commonWaivers {
		if !shouldSuggestWaiver(cw, survey) {
			continue
		}
		sw := models.NewSuggestedWaiver(principal.Account().ID, survey.ModelPlanID, cw.ID)
		if _, err := storage.SuggestedWaiverCreate(np, logger, sw); err != nil {
			return err
		}
	}
	return nil
}

// shouldSuggestWaiver returns false only when the waiver has a survey_question_field mapping
// AND that survey question was explicitly answered false.
func shouldSuggestWaiver(cw *models.CommonWaiver, survey *models.WaiverAssessmentSurvey) bool {
	if cw.SurveyQuestionField == nil {
		return true
	}
	val := surveyBoolField(survey, *cw.SurveyQuestionField)
	if val == nil {
		return true // unanswered — keep suggesting
	}
	return *val
}

// surveyBoolField looks up a boolean field on WaiverAssessmentSurvey by its DB column name.
// Returns nil if the column name is unknown or the field is unset.
// Add new cases here when new survey questions are introduced.
func surveyBoolField(s *models.WaiverAssessmentSurvey, col string) *bool {
	switch col {
	case "modifies_medicare_savings_programs":
		return s.ModifiesMedicareSavingsPrograms
	case "bundles_payments":
		return s.BundlesPayments
	case "offers_risk_sharing_arrangements":
		return s.OffersRiskSharingArrangements
	case "impacts_site_of_care_payments":
		return s.ImpactsSiteOfCarePayments
	case "modifies_care_team_scope_of_practice":
		return s.ModifiesCareTeamScopeOfPractice
	case "modifies_care_delivery_with_claims_based_payments":
		return s.ModifiesCareDeliveryWithClaimsBasedPayments
	case "modifies_quality_measurements_or_payments_via_waivers":
		return s.ModifiesQualityMeasurementsOrPaymentsViaWaivers
	case "impacts_medicaid_only_beneficiaries":
		return s.ImpactsMedicaidOnlyBeneficiaries
	case "impacts_home_community_based_service_payments":
		return s.ImpactsHomeCommunityBasedServicePayments
	case "impacts_managed_care_waivers":
		return s.ImpactsManagedCareWaivers
	default:
		return nil
	}
}

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

			// TODO: Consider moving this to the database layer so it's guaranteed to run on every update, not just those from this resolver.

			if err := RecalculateSuggestedWaivers(ctx, tx, logger, updated, principal); err != nil {
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

// TrySendWaiverAssessmentSurveyNotifications fires in-app and email notifications when a
// waiver assessment survey transitions to COMPLETE. Errors are logged but do not fail the
// parent transaction since notification delivery is best-effort.
func TrySendWaiverAssessmentSurveyNotifications(
	ctx context.Context,
	survey *models.WaiverAssessmentSurvey,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	modelPlan, err := ModelPlanGetByIDLOADER(ctx, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to load model plan", zap.Error(err))
		return
	}

	uans, err := storage.UserAccountGetNotificationPreferencesForWaiverAssessmentSurveyMarkedComplete(np, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to get notification preferences", zap.Error(err))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(uans)

	_, err = notifications.ActivityWaiverAssessmentSurveyMarkedCompleteCreate(
		ctx,
		principal.Account().ID,
		np,
		inAppUANs,
		survey.ModelPlanID,
		survey.ID,
		principal.Account().ID,
	)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to create activity", zap.Error(err))
		return
	}

	go func() {
		if emailService == nil {
			return
		}

		// Send to MINT team (no footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmail(
			emailService,
			emailAddressBook,
			modelPlan,
			emailAddressBook.MINTTeamEmail,
			principal.Account().CommonName,
			false,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send MINT team email", zap.Error(err))
			return
		}

		// Send to opted-in users (with footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmails(
			emailService,
			emailAddressBook,
			emailUANs,
			modelPlan,
			principal.Account().CommonName,
			true,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send user emails", zap.Error(err))
		}
	}()
}

func getWaiverAssessmentSurveyMarkedCompleteEmailContent(
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) (string, string, error) {
	subjectContent := email.WaiverAssessmentSurveyCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.WaiverAssessmentSurveyCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompleteByCommonName,
	}
	return email.WaiverAssessmentSurvey.Completed.GetContent(subjectContent, bodyContent)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	return emailService.Send(addressBook.DefaultSender, []string{userEmail}, nil, subject, "text/html", body)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmails(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	receiverEmails := lo.Map(receivers, func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
		return pref.Email
	})
	return emailService.Send(addressBook.DefaultSender, []string{}, nil, subject, "text/html", body, oddmail.WithBCC(receiverEmails))
}
