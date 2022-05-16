package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ModelPlanCreate implements resolver logic to create a model plan
func ModelPlanCreate(logger *zap.Logger, modelName string, store *storage.Store, principalInfo *models.UserInfo) (*models.ModelPlan, error) {
	plan := &models.ModelPlan{
		ModelName:  modelName,
		Status:     models.ModelStatusPlanDraft,
		CreatedBy:  &principalInfo.EuaUserID,
		ModifiedBy: &principalInfo.EuaUserID,
	}

	createdPlan, err := store.ModelPlanCreate(logger, plan)
	if err != nil {
		return nil, err
	}
	/*TODO Revist this
	- we might want to add a plan collaborator in the scope of a single SQLX transaction and roll back the transaction if a collaborator was not successfully created
	  - this could be in a combined store for collaborator / plan
	- we could also address this directly in SQL, create the plan and collaborator at the same time.
	*/
	collabInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: createdPlan.ID,
		EuaUserID:   principalInfo.EuaUserID,
		FullName:    principalInfo.CommonName,
		TeamRole:    models.TeamRoleModelLead,
	}
	_, err = CreatePlanCollaborator(logger, collabInput, principalInfo.EuaUserID, store)
	if err != nil {
		return nil, err
	}

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
