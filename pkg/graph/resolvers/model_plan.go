package resolvers

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/notifications"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ModelPlanCreate implements resolver logic to create a model plan, and send relevant notifications about it's creation
// It also creates a record for all the task list items at the same time.
// It utilizes transactions to ensure that the data can be rolled back if there is an error at any point along the way.
func ModelPlanCreate(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelName string,
	store *storage.Store,
	principal authentication.Principal,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.ModelPlan, error) {

	var newModelPlanEmailPrefs []*models.UserAccountAndNotificationPreferences

	newPlan, err := sqlutils.WithTransaction[models.ModelPlan](store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {
		plan := models.NewModelPlan(principal.Account().ID, modelName)

		err := BaseStructPreCreate(logger, plan, principal, store, false) //We don't check access here, because the user can't yet be a collaborator. Collaborators are created after ModelPlan initiation.
		if err != nil {
			return nil, err
		}

		userAccount := principal.Account()

		createdPlan, err := store.ModelPlanCreate(tx, logger, plan)

		if err != nil {
			return nil, err
		}

		baseTaskListUser := models.NewBaseTaskListSection(userAccount.ID, createdPlan.ID)

		// Create a default plan basics object

		basics := models.NewPlanBasics(baseTaskListUser)
		_, err = store.PlanBasicsCreate(tx, logger, basics)
		if err != nil {
			return nil, err
		}

		// Create a default plan general characteristics object
		generalCharacteristics := models.NewPlanGeneralCharacteristics(baseTaskListUser)

		_, err = store.PlanGeneralCharacteristicsCreate(tx, logger, generalCharacteristics)
		if err != nil {
			return nil, err
		}
		// Create a default Plan Beneficiares object
		beneficiaries := models.NewPlanBeneficiaries(baseTaskListUser)

		_, err = store.PlanBeneficiariesCreate(tx, logger, beneficiaries)
		if err != nil {
			return nil, err
		}

		//Create a default Plan Participants and Providers object
		participantsAndProviders := models.NewPlanParticipantsAndProviders(baseTaskListUser)

		_, err = store.PlanParticipantsAndProvidersCreate(tx, logger, participantsAndProviders)
		if err != nil {
			return nil, err
		}

		//Create default Plan OpsEvalAndLearning object
		opsEvalAndLearning := models.NewPlanOpsEvalAndLearning(baseTaskListUser)

		_, err = store.PlanOpsEvalAndLearningCreate(tx, logger, opsEvalAndLearning)
		if err != nil {
			return nil, err
		}

		//Create default PlanPayments object
		planPayments := models.NewPlanPayments(baseTaskListUser)

		_, err = store.PlanPaymentsCreate(tx, logger, planPayments)
		if err != nil {
			return nil, err
		}

		//Create default Operational Needs
		_, err = store.OperationalNeedInsertAllPossible(tx, logger, createdPlan.ID, principal.Account().ID)
		if err != nil {
			return nil, err
		}

		// Create an initial collaborator for the plan
		_, _, err = PlanCollaboratorCreate(
			ctx,
			tx,
			store,
			logger,
			nil,
			nil,
			email.AddressBook{},
			&model.PlanCollaboratorCreateInput{
				ModelPlanID: createdPlan.ID,
				UserName:    *userAccount.Username,
				TeamRoles:   []models.TeamRole{models.TeamRoleModelLead},
			},
			principal,
			false,
			getAccountInformation,
			false,
		)
		if err != nil {
			return nil, err
		}

		notifPreferences, err := store.UserAccountNotificationPreferencesNewModelPlan(tx)
		if err != nil {
			return nil, err
		}

		newModelPlanEmailPrefs, _ = models.FilterNotificationPreferences(notifPreferences)

		_, err = notifications.ActivityNewModelPlanCreate(
			ctx,
			tx,
			principal.Account().ID,
			plan.ID,
			notifPreferences,
		)
		if err != nil {
			return nil, err
		}

		return createdPlan, nil
	})
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		go func() {
			sendEmailErr := sendModelPlanCreatedEmail(
				ctx,
				emailService,
				emailTemplateService,
				addressBook,
				[]string{addressBook.MINTTeamEmail},
				newPlan,
				false,
			)
			if sendEmailErr != nil {
				logger.Error("failed to send model plan created email to dev team", zap.String(
					"createdPlanID",
					newPlan.ID.String(),
				), zap.Error(sendEmailErr))
			}
		}()

		receiverEmails := lo.Map(
			newModelPlanEmailPrefs,
			func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
				return pref.Email
			},
		)

		go func() {
			sendEmailErr := sendModelPlanCreatedEmail(
				ctx,
				emailService,
				emailTemplateService,
				addressBook,
				receiverEmails,
				newPlan,
				true,
			)
			if sendEmailErr != nil {
				logger.Error("failed to send model plan created email to user", zap.String(
					"createdPlanID",
					newPlan.ID.String(),
				), zap.Error(sendEmailErr))
			}
		}()
	}

	return newPlan, err
}

func sendModelPlanCreatedEmail(
	ctx context.Context,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	receiverEmails []string,
	modelPlan *models.ModelPlan,
	showFooter bool,
) error {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanCreatedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanCreatedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}
	createdByAccount, err := modelPlan.CreatedByUserAccount(ctx)
	if err != nil {
		return fmt.Errorf("unable to get the user account for the user who created the model. err %w", err)
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanCreatedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		UserName:      createdByAccount.CommonName,
		ShowFooter:    showFooter,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{},
		nil,
		emailSubject,
		"text/html",
		emailBody,
		oddmail.WithBCC(receiverEmails),
	)
	if err != nil {
		return err
	}
	return nil
}

// ModelPlanUpdate implements resolver logic to update a model plan
func ModelPlanUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.ModelPlan, error) {
	// Get existing plan
	existingPlan, err := store.ModelPlanGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPlan, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	retPlan, err := store.ModelPlanUpdate(logger, existingPlan)
	if err != nil {
		return nil, err
	}
	return retPlan, err

}

// ModelPlanGetByID implements resolver logic to get a model plan by its ID
func ModelPlanGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// ModelPlanGetByIDLOADER implements resolver logic to get Model Plan by a model plan ID using a data loader
func ModelPlanGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	allLoaders := loaders.Loaders(ctx)
	planLoader := allLoaders.ModelPlanLoader
	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := planLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.ModelPlan), nil
}

// ModelPlanOpSolutionLastModifiedDtsGetByIDLOADER implements resolver logic to get Model Plan
// Operational Solution Last Modified Dts by a model plan ID using a data loader
func ModelPlanOpSolutionLastModifiedDtsGetByIDLOADER(ctx context.Context, id uuid.UUID) (*time.Time, error) {
	allLoaders := loaders.Loaders(ctx)
	planTrackingDateLoader := allLoaders.ModelPlanOpSolutionLastModifiedDtsLoader
	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := planTrackingDateLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	convertedTime, timeConvertedOk := result.(*time.Time)
	if !timeConvertedOk {
		return nil, fmt.Errorf("failed to convert time from loader")
	}

	return convertedTime, nil
}

// ModelPlanGetSampleModel returns the sample model plan
func ModelPlanGetSampleModel(logger *zap.Logger, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByName(logger, constants.SampleModelName)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// ModelPlanCollection implements resolver logic to get a list of model plans by who's a collaborator on them (TODO)
func ModelPlanCollection(logger *zap.Logger, principal authentication.Principal, store *storage.Store, filter model.ModelPlanFilter) ([]*models.ModelPlan, error) {
	var modelPlans []*models.ModelPlan
	var err error
	switch filter {
	case model.ModelPlanFilterIncludeAll:
		modelPlans, err = store.ModelPlanCollection(logger, false)
	case model.ModelPlanFilterCollabOnly:
		modelPlans, err = store.ModelPlanCollectionCollaboratorOnly(logger, false, principal.Account().ID)
	case model.ModelPlanFilterWithCrTdls:
		modelPlans, err = store.ModelPlanCollectionWithCRTDLS(logger, false)
	case model.ModelPlanFilterFavorited:
		modelPlans, err = store.ModelPlanCollectionFavorited(logger, false, principal.Account().ID)
	case model.ModelPlanFilterApproachingClearance:
		modelPlans, err = storage.ModelPlanCollectionApproachingClearance(store, logger)
	default:
		modelPlans = nil
		err = fmt.Errorf("model plan filter not defined for filter: %s", filter)
	}

	return modelPlans, err
}

// ModelPlanNameHistory returns a slice of AuditChanges, with the only values returned being the model_name field
func ModelPlanNameHistory(logger *zap.Logger, modelPlanID uuid.UUID, sortDir models.SortDirection, store *storage.Store) ([]string, error) {
	fieldName := "model_name"

	changes, err := store.AuditChangeCollectionByIDAndTableAndField(logger, "model_plan", modelPlanID, fieldName, sortDir)
	nameHistory := make([]string, len(changes)) // more efficient than appending
	for i := 0; i < len(changes); i++ {

		nameField := changes[i].Fields[fieldName]
		name := fmt.Sprintf("%s", nameField.New)

		nameHistory[i] = name

	}
	if err != nil {
		return nil, err
	}

	return nameHistory, nil
}

// ModelPlanShare implements resolver logic to share a model plan with a list of emails
func ModelPlanShare(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	viewFilter *models.ModelViewFilter,
	usernames []string,
	optionalMessage *string,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (bool, error) {
	modelPlan, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return false, err
	}

	planBasics, err := PlanBasicsGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return false, err
	}

	receiverEmails := make([]string, 0)
	receiverIDs := make([]uuid.UUID, 0)

	for _, username := range usernames {
		collabAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			store,
			store,
			username,
			false,
			false,
			getAccountInformation,
		)
		if err != nil {
			return false, fmt.Errorf("failed to get or create user account: %w", err)
		}

		userPrefs, err := loaders.UserNotificationPreferencesGetByUserID(ctx, collabAccount.ID)
		if err != nil {
			return false, fmt.Errorf("failed to get user notification preferences: %w", err)
		}

		receiverIDs = append(receiverIDs, collabAccount.ID)

		if userPrefs.ModelPlanShared.SendEmail() {
			receiverEmails = append(receiverEmails, collabAccount.Email)
		}
	}

	// Send notification to all the users
	_, err = notifications.ActivityModelPlanSharedCreate(ctx, store, principal.Account().ID, receiverIDs, modelPlanID, optionalMessage, loaders.UserNotificationPreferencesGetByUserID)
	if err != nil {
		return false, fmt.Errorf("failed to create activity: %w", err)
	}

	// Get client address
	clientAddress := emailService.GetConfig().GetClientAddress()

	// Get email template
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanShareTemplateName)
	if err != nil {
		return false, fmt.Errorf("failed to get email template: %w", err)
	}

	// Get email subject
	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanShareSubjectContent{
		UserName: principal.Account().CommonName,
	})
	if err != nil {
		return false, fmt.Errorf("failed to execute email subject: %w", err)
	}

	var modelPlanCategoriesHumainzed []string
	if planBasics.ModelCategory != nil {
		modelPlanCategoriesHumainzed = append(modelPlanCategoriesHumainzed, models.ModelCategoryHumanized[*planBasics.ModelCategory])
	}

	for _, category := range planBasics.AdditionalModelCategories {
		// Have to cast the additional category as a models.ModelCategory so we can fetch it from the models.ModelCategoryHumanized map
		modelPlanCategoriesHumainzed = append(modelPlanCategoriesHumainzed, models.ModelCategoryHumanized[models.ModelCategory(category)])
	}

	lastModified := modelPlan.CreatedDts
	if modelPlan.ModifiedDts != nil {
		lastModified = *modelPlan.ModifiedDts
	}

	planCollaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return false, fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	var modelLeads []string
	for _, collaborator := range planCollaborators {
		for _, role := range collaborator.TeamRoles {
			if role == string(models.TeamRoleModelLead) {
				collabAccount, accountErr := collaborator.UserAccount(ctx)
				if accountErr != nil {
					return false, fmt.Errorf("failed to get model lead collaborator user account for model_plan_share")
				}
				modelLeads = append(modelLeads, collabAccount.CommonName)
				break
			}
		}
	}

	humanizedModelStatus := models.ModelStatusHumanized[modelPlan.Status]

	var humanizedViewFilter *string
	var lowercasedViewFilter *string
	if viewFilter != nil {
		humanizedViewFilter = models.StringPointer(
			models.ModelViewFilterHumanized[*viewFilter])

		lowercasedViewFilter = models.StringPointer(
			strings.ToLower(string(*viewFilter)))
	}

	// Get email body
	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanShareBodyContent{
		UserName:                 principal.Account().CommonName,
		OptionalMessage:          optionalMessage,
		ModelName:                modelPlan.ModelName,
		ModelShortName:           modelPlan.Abbreviation,
		ModelCategories:          modelPlanCategoriesHumainzed,
		ModelStatus:              humanizedModelStatus,
		ModelLastUpdated:         lastModified,
		ModelLeads:               modelLeads,
		ModelViewFilter:          lowercasedViewFilter,
		HumanizedModelViewFilter: humanizedViewFilter,
		ClientAddress:            clientAddress,
		ModelID:                  modelPlan.ID.String(),
	})
	if err != nil {
		return false, fmt.Errorf("failed to execute email body: %w", err)
	}

	// Send email
	if len(receiverEmails) > 0 {
		err = emailService.Send(addressBook.DefaultSender, receiverEmails, nil, emailSubject, "text/html", emailBody)
		if err != nil {
			return false, fmt.Errorf("failed to send email: %w", err)
		}
	}

	return true, nil
}
