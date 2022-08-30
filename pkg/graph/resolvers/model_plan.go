package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ModelPlanCreate implements resolver logic to create a model plan
// TODO Revist this function, as we probably want to add all of these DB entries inthe scope of a single SQL transaction
// so that we can roll back if there is an error with any of these calls.
func ModelPlanCreate(logger *zap.Logger, modelName string, store *storage.Store, principalInfo *models.UserInfo, principal authentication.Principal) (*models.ModelPlan, error) {
	plan := &models.ModelPlan{
		ModelName: modelName,
		Status:    models.ModelStatusPlanDraft,
		BaseStruct: models.BaseStruct{
			CreatedBy: principalInfo.EuaUserID,
		},
	}

	err := BaseStructPreCreate(logger, plan, principal, store, false) //We don't check access here, because the user can't yet be a collaborator. Collaborators are created after ModelPlan initiation.
	if err != nil {
		return nil, err
	}

	// Create the model plan itself
	createdPlan, err := store.ModelPlanCreate(logger, plan)
	if err != nil {
		return nil, err
	}

	// Create an initial collaborator for the plan
	collab := &models.PlanCollaborator{
		ModelPlanRelation: models.ModelPlanRelation{
			ModelPlanID: createdPlan.ID,
		},
		EUAUserID: principalInfo.EuaUserID,
		FullName:  principalInfo.CommonName,
		TeamRole:  models.TeamRoleModelLead,
		Email:     principalInfo.Email.String(),
		BaseStruct: models.BaseStruct{
			CreatedBy: principalInfo.EuaUserID,
		},
	}
	_, err = store.PlanCollaboratorCreate(logger, collab)
	if err != nil {
		return nil, err
	}

	baseTaskList := models.NewBaseTaskListSection(createdPlan.ID, principalInfo.EuaUserID) //make a taskList status, with status Ready
	//TODO, should we make a BASE STRUCT FIRST? Then we can pass that to every sub struct

	// Create a default plan basics object
	basics := &models.PlanBasics{
		BaseTaskListSection: baseTaskList,
	}

	_, err = store.PlanBasicsCreate(logger, basics)
	if err != nil {
		return nil, err
	}

	// Create a default plan general characteristics object
	generalCharacteristics := &models.PlanGeneralCharacteristics{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanGeneralCharacteristicsCreate(logger, generalCharacteristics)
	if err != nil {
		return nil, err
	}
	// Create a default Plan Beneficiares object
	beneficiaries := &models.PlanBeneficiaries{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanBeneficiariesCreate(logger, beneficiaries)
	if err != nil {
		return nil, err
	}
	//Create a default Plan Participants and Providers object
	participantsAndProviders := &models.PlanParticipantsAndProviders{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanParticipantsAndProvidersCreate(logger, participantsAndProviders)
	if err != nil {
		return nil, err
	}

	//Create default Plan OpsEvalAndLearning object
	opsEvalAndLearning := &models.PlanOpsEvalAndLearning{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanOpsEvalAndLearningCreate(logger, opsEvalAndLearning)
	if err != nil {
		return nil, err
	}

	//Create default PlanPayments object
	planPayments := &models.PlanPayments{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanPaymentsCreate(logger, planPayments)
	if err != nil {
		return nil, err
	}

	//Create default PlanITTools object
	itTools := &models.PlanITTools{
		BaseTaskListSection: baseTaskList,
	}
	_, err = store.PlanITToolsCreate(logger, itTools)
	if err != nil {
		return nil, err
	}

	return createdPlan, err
}

// ModelPlanUpdate implements resolver logic to update a model plan
func ModelPlanUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.ModelPlan, error) {
	// Get existing plan
	existingPlan, err := store.ModelPlanGetByID(logger, id)
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
	plan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// ModelPlanCollection implements resolver logic to get a list of model plans by who's a collaborator on them (TODO)
func ModelPlanCollection(logger *zap.Logger, principal authentication.Principal, store *storage.Store) ([]*models.ModelPlan, error) {
	plans, err := store.ModelPlanCollection(logger, false)
	if err != nil {
		return nil, err
	}

	return plans, err
}
