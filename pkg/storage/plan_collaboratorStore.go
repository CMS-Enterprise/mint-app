package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
)

//go:embed SQL/plan_collaborator/create.sql
var planCollaboratorCreateSQL string

//go:embed SQL/plan_collaborator/update.sql
var planCollaboratorUpdateSQL string

//go:embed SQL/plan_collaborator/delete.sql
var planCollaboratorDeleteSQL string

//go:embed SQL/plan_collaborator/fetch_by_model_plan_id.sql
var planCollaboratorFetchByModelPlanIDSQL string

//go:embed SQL/plan_collaborator/fetch_by_id.sql
var planCollaboratorFetchByIDSQL string

//go:embed SQL/plan_collaborator/get_by_model_plan_id_LOADER.sql
var planCollaboratorGetByModelPlanIDLoaderSQL string

// PlanCollaboratorGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanCollaboratorGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.PlanCollaborator, error) {
	collabSlice := []*models.PlanCollaborator{}

	stmt, err := s.db.PrepareNamed(planCollaboratorGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&collabSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return collabSlice, nil
}

// PlanCollaboratorCreate creates a new plan collaborator
func (s *Store) PlanCollaboratorCreate(_ *zap.Logger, collaborator *models.PlanCollaborator) (*models.PlanCollaborator, error) {

	collaborator.ID = utilityUUID.ValueOrNewUUID(collaborator.ID)

	statement, err := s.db.PrepareNamed(planCollaboratorCreateSQL)
	if err != nil {
		return nil, err
	}

	collaborator.ModifiedBy = nil
	collaborator.ModifiedDts = nil

	err = statement.Get(collaborator, collaborator)
	if err != nil {
		return nil, err
	}

	return collaborator, nil
}

// PlanCollaboratorUpdate updates the plan collaborator for a given id
func (s *Store) PlanCollaboratorUpdate(_ *zap.Logger, collaborator *models.PlanCollaborator) (*models.PlanCollaborator, error) {
	statement, err := s.db.PrepareNamed(planCollaboratorUpdateSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(collaborator, collaborator)
	if err != nil {
		return nil, err
	}

	return collaborator, nil
}

// PlanCollaboratorDelete deletes the plan collaborator for a given id
func (s *Store) PlanCollaboratorDelete(_ *zap.Logger, id uuid.UUID) (*models.PlanCollaborator, error) {
	statement, err := s.db.PrepareNamed(planCollaboratorDeleteSQL)
	if err != nil {
		return nil, err
	}

	collaborator := &models.PlanCollaborator{}
	err = statement.Get(collaborator, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return collaborator, nil
}

// PlanCollaboratorsByModelPlanID returns the plan collaborators for a given model plan id
func (s *Store) PlanCollaboratorsByModelPlanID(_ *zap.Logger, modelPlanID uuid.UUID) ([]*models.PlanCollaborator, error) {
	var collaborators []*models.PlanCollaborator

	statement, err := s.db.PrepareNamed(planCollaboratorFetchByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = statement.Select(&collaborators, arg)
	if err != nil {
		return nil, err
	}

	return collaborators, nil
}

// PlanCollaboratorFetchByID returns a plan collaborator for a given database ID, or nil if none found
func (s *Store) PlanCollaboratorFetchByID(id uuid.UUID) (*models.PlanCollaborator, error) {
	statement, err := s.db.PrepareNamed(planCollaboratorFetchByIDSQL)
	if err != nil {
		return nil, err
	}

	var collaborator models.PlanCollaborator
	err = statement.Get(&collaborator, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &collaborator, nil
}
