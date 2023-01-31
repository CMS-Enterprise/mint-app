package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanCollaborator implements resolver logic to create a plan collaborator
// If the email service or email template service is not provided this method will not
//
//	send the collaborator a notification email
//
// A plan favorite is created for the collaborating user when the user is added as a collaborator
func CreatePlanCollaborator(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	input *model.PlanCollaboratorCreateInput,
	principal authentication.Principal,
	store *storage.Store,
	checkAccess bool,
	getAccountInformation userhelpers.GetAccountInfoFunc) (*models.PlanCollaborator, *models.PlanFavorite, error) {

	isMacUser := false
	collabAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, input.UserName, false, isMacUser, getAccountInformation)
	if err != nil {
		return nil, nil, err
	}

	collaborator := models.NewPlanCollaborator(principal.Account().ID, input.ModelPlanID, collabAccount.ID, input.TeamRole)
	err = BaseStructPreCreate(logger, collaborator, principal, store, checkAccess)
	if err != nil {
		return nil, nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(logger, input.ModelPlanID)
	if err != nil {
		return nil, nil, err
	}

	retCollaborator, err := store.PlanCollaboratorCreate(logger, collaborator)
	if err != nil {
		return nil, nil, err
	}

	planFavorite, err := PlanFavoriteCreate(logger, principal, collabAccount.ID, store, modelPlan.ID)
	if err != nil {
		return retCollaborator, nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		err = sendCollaboratorAddedEmail(emailService, emailTemplateService, collabAccount.Email, modelPlan)
		if err != nil {
			return retCollaborator, planFavorite, err
		}
	}

	return retCollaborator, planFavorite, nil
}

func sendCollaboratorAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
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

	err = emailService.Send(emailService.GetConfig().GetDefaultSender(), []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

// UpdatePlanCollaborator implements resolver logic to update a plan collaborator
func UpdatePlanCollaborator(logger *zap.Logger, id uuid.UUID, newRole models.TeamRole, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	// Get existing collaborator
	existingCollaborator, err := store.PlanCollaboratorFetchByID(id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreUpdate(logger, existingCollaborator, nil, principal, store, false, true)
	if err != nil {
		return nil, err
	}

	existingCollaborator.TeamRole = newRole

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
	retCollaborator, err := store.PlanCollaboratorDelete(logger, id)
	return retCollaborator, err
}

// FetchCollaboratorsByModelPlanID implements resolver logic to fetch a list of plan collaborators by a model plan ID
func FetchCollaboratorsByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCollaborator, error) {
	collaborators, err := store.PlanCollaboratorsByModelPlanID(logger, modelPlanID)
	return collaborators, err
}

// FetchCollaboratorByID implements resolver logic to fetch a plan collaborator by ID
func FetchCollaboratorByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCollaborator, error) {
	collaborator, err := store.PlanCollaboratorFetchByID(id)
	return collaborator, err
}

// IsPlanCollaborator checks if a user is a collaborator on model plan is a favorite.
func IsPlanCollaborator(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {
	return store.CheckIfCollaborator(logger, principal.Account().ID, modelPlanID)
}
