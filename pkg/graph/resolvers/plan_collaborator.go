package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanCollaborator implements resolver logic to create a plan collaborator
func CreatePlanCollaborator(
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService *email.TemplateService,
	input *model.PlanCollaboratorCreateInput,
	principal authentication.Principal,
	store *storage.Store) (*models.PlanCollaborator, error) {
	collaborator := models.NewPlanCollaborator(principal.ID(), input.ModelPlanID, input.EuaUserID, input.FullName, input.TeamRole, input.Email)
	err := BaseStructPreCreate(logger, collaborator, principal, store, true)
	if err != nil {
		return nil, err
	}

	retCollaborator, err := store.PlanCollaboratorCreate(logger, collaborator)
	if err != nil {
		return nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(logger, input.ModelPlanID)
	if err != nil {
		return nil, err
	}

	err = sendCollaboratorAddedEmail(emailService, emailTemplateService, input.Email, modelPlan)
	if err != nil {
		return nil, err
	}

	return retCollaborator, nil
}

func sendCollaboratorAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService *email.TemplateService,
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
		ModelName: modelPlan.ModelName,
		ModelID:   modelPlan.GetModelPlanID().String(),
	})
	if err != nil {
		return err
	}

	senderEmail := email.DefaultSender
	err = emailService.Send(senderEmail, []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
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
	return store.CheckIfCollaborator(logger, principal.ID(), modelPlanID)
}
