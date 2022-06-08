package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ModelPlanCreate implements resolver logic to create a model plan
// TODO Revist this function, as we probably want to add all of these DB entries inthe scope of a single SQL transaction
// so that we can roll back if there is an error with any of these calls.
func ModelPlanCreate(logger *zap.Logger, modelName string, store *storage.Store, principalInfo *models.UserInfo) (*models.ModelPlan, error) {
	plan := &models.ModelPlan{
		ModelName: modelName,
		Status:    models.ModelStatusPlanDraft,
		CreatedBy: principalInfo.EuaUserID,
	}

	// Create the model plan itself
	createdPlan, err := store.ModelPlanCreate(logger, plan)
	if err != nil {
		return nil, err
	}

	// Create an initial collaborator for the plan
	collab := &models.PlanCollaborator{
		ModelPlanID: createdPlan.ID,
		EUAUserID:   principalInfo.EuaUserID,
		FullName:    principalInfo.CommonName,
		TeamRole:    models.TeamRoleModelLead,
		CreatedBy:   principalInfo.EuaUserID,
	}
	_, err = store.PlanCollaboratorCreate(logger, collab)
	if err != nil {
		return nil, err
	}

	// Create a default plan basics object
	basics := &models.PlanBasics{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
	}
	err = basics.CalcStatus()
	if err != nil {
		return nil, err
	}
	_, err = store.PlanBasicsCreate(logger, basics)
	if err != nil {
		return nil, err
	}

	// Create a default plan milestones object
	milestones := &models.PlanMilestones{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
	}
	err = milestones.CalcStatus()
	if err != nil {
		return nil, err
	}
	_, err = store.PlanMilestonesCreate(logger, milestones)
	if err != nil {
		return nil, err
	}

	// Create a default plan general characteristics object
	generalCharacteristics := &models.PlanGeneralCharacteristics{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
		ModifiedBy:  &principalInfo.EuaUserID,
	}
	err = generalCharacteristics.CalcStatus()
	if err != nil {
		return nil, err
	}
	_, err = store.PlanGeneralCharacteristicsCreate(logger, generalCharacteristics)
	if err != nil {
		return nil, err
	}
	beneficiaries := &models.PlanBeneficiaries{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
	}
	err = beneficiaries.CalcStatus()
	if err != nil {
		return nil, err
	}

	_, err = store.PlanBeneficiariesCreate(logger, beneficiaries)
	if err != nil {
		return nil, err
	}
	participantsAndProviders := &models.PlanParticipantsAndProviders{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
		ModifiedBy:  &principalInfo.EuaUserID,
	}
	err = participantsAndProviders.CalcStatus()
	if err != nil {
		return nil, err
	}
	_, err = store.PlanParticipantsAndProvidersCreate(logger, participantsAndProviders)
	if err != nil {
		return nil, err
	}

	opsEvalAndLearning := &models.PlanOpsEvalAndLearning{
		ModelPlanID: createdPlan.ID,
		CreatedBy:   principalInfo.EuaUserID,
		ModifiedBy:  &principalInfo.EuaUserID,
	}
	err = opsEvalAndLearning.CalcStatus()
	if err != nil {
		return nil, err
	}
	_, err = store.PlanOpsEvalAndLearningCreate(logger, opsEvalAndLearning)

	return createdPlan, err
}

// ModelPlanUpdate implements resolver logic to update a model plan
func ModelPlanUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal *string, store *storage.Store) (*models.ModelPlan, error) {
	// Get existing plan
	existingPlan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChanges(changes, existingPlan)
	if err != nil {
		return nil, err
	}

	existingPlan.ModifiedBy = principal

	retPlan, err := store.ModelPlanUpdate(logger, existingPlan)
	if err != nil {
		return nil, err
	}
	return retPlan, err

}

// ModelPlanGetByID implements resolver logic to get a model plan by its ID
func ModelPlanGetByID(logger *zap.Logger, principal string, id uuid.UUID, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	//TODO add job code authorization Checks?

	return plan, nil
}

// ModelPlanCollectionByUser implements resolver logic to get a list of model plans by who's a collaborator on them (TODO)
func ModelPlanCollectionByUser(logger *zap.Logger, principal string, store *storage.Store) ([]*models.ModelPlan, error) {
	plans, err := store.ModelPlanCollectionByUser(logger, principal, false)
	if err != nil {
		return nil, err
	}

	return plans, err
}
