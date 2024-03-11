package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanCollaboratorTransaction implements resolver logic to create a plan collaborator
// If the email service or email template service is not provided this method will not
//
//	send the collaborator a notification email
//
// A plan favorite is created for the collaborating user when the user is added as a collaborator
// The transaction object does not commit or rollback in the scope of this function
func CreatePlanCollaborator(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	input *model.PlanCollaboratorCreateInput,
	principal authentication.Principal,
	checkAccess bool,
	getAccountInformation userhelpers.GetAccountInfoFunc,
	createNotification bool,
) (*models.PlanCollaborator, *models.PlanFavorite, error) {
	//TODO make these clustered with store methods?

	isMacUser := false
	collabAccount, err := userhelpers.GetOrCreateUserAccount(ctx, np, store, input.UserName, false, isMacUser, getAccountInformation)
	if err != nil {
		return nil, nil, err
	}

	collaborator := models.NewPlanCollaborator(principal.Account().ID, input.ModelPlanID, collabAccount.ID, input.TeamRoles)
	err = BaseStructPreCreate(logger, collaborator, principal, store, checkAccess)
	if err != nil {
		return nil, nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(np, logger, input.ModelPlanID)
	if err != nil {
		return nil, nil, err
	}

	retCollaborator, err := store.PlanCollaboratorCreate(np, logger, collaborator)
	if err != nil {
		return nil, nil, err
	}

	planFavorite, err := PlanFavoriteCreate(np, logger, principal, collabAccount.ID, store, modelPlan.ID)
	if err != nil {
		return retCollaborator, nil, err
	}
	// If a this is false, we return without creating a notification or an email.
	if !createNotification {

		return retCollaborator, planFavorite, nil
	}

	_, notificationError := notifications.ActivityAddedAsCollaboratorCreate(ctx, np, principal.Account().ID, modelPlan.ID, retCollaborator.ID, collabAccount.ID, loaders.UserNotificationPreferencesGetByUserID)
	if notificationError != nil {
		return nil, nil, notificationError
	}
	// TODO: EASI-(EASI-3945) Double check, do we need to insure that the user who makes the model plan doesn't get notified about being added a collaborator?
	// If so, we might need to revisit this logic.
	pref, err := loaders.UserNotificationPreferencesGetByUserID(ctx, collabAccount.ID)
	if err != nil {
		return nil, nil, fmt.Errorf("issue creating collaborator, couldn't get collaborator preferences. Err: %w", err)

	}

	if emailService != nil && emailTemplateService != nil && pref.AddedAsCollaborator.SendEmail() {
		err = sendCollaboratorAddedEmail(emailService, emailTemplateService, addressBook, collabAccount.Email, modelPlan)
		if err != nil {
			return retCollaborator, planFavorite, err
		}
	}

	return retCollaborator, planFavorite, nil
}

func sendCollaboratorAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	receiverEmail string,
	modelPlan *models.ModelPlan,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.AddedAsCollaboratorTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.AddedAsCollaboratorSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.AddedAsCollaboratorBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

// UpdatePlanCollaborator implements resolver logic to update a plan collaborator
func UpdatePlanCollaborator(logger *zap.Logger, id uuid.UUID, newRoles []models.TeamRole, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	// Get existing collaborator
	existingCollaborator, err := store.PlanCollaboratorFetchByID(id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreUpdate(logger, existingCollaborator, nil, principal, store, false, true)
	if err != nil {
		return nil, err
	}

	existingCollaborator.TeamRoles = models.ConvertEnumsToStringArray(newRoles)

	return store.PlanCollaboratorUpdate(logger, existingCollaborator)
}

// DeletePlanCollaborator implements resolver logic to delete a plan collaborator
func DeletePlanCollaborator(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	existingCollaborator, err := store.PlanCollaboratorFetchByID(id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreDelete(logger, existingCollaborator, principal, store, true)
	if err != nil {
		return nil, err
	}
	retCollaborator, err := store.PlanCollaboratorDelete(logger, id, principal.Account().ID)
	return retCollaborator, err
}

// PlanCollaboratorGetByModelPlanIDLOADER implements resolver logic to get Plan Collaborator by a model plan ID using a data loader
func PlanCollaboratorGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.PlanCollaborator, error) {
	allLoaders := loaders.Loaders(ctx)
	collabLoader := allLoaders.PlanCollaboratorLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := collabLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.PlanCollaborator), nil
}

// FetchCollaboratorByID implements resolver logic to fetch a plan collaborator by ID
func FetchCollaboratorByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCollaborator, error) {
	//TODO: EASI-(EASI-3945) Consider making this a data loader. The naming could be unified as well.
	collaborator, err := store.PlanCollaboratorFetchByID(id)
	return collaborator, err
}

// IsPlanCollaborator checks if a user is a collaborator on model plan is a favorite.
func IsPlanCollaborator(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {
	return store.CheckIfCollaborator(logger, principal.Account().ID, modelPlanID)
}
