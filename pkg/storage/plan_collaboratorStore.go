package storage

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/sqlutils"

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

//go:embed SQL/plan_collaborator/fetch_by_id.sql
var planCollaboratorFetchByIDSQL string

//go:embed SQL/plan_collaborator/get_by_model_plan_id_LOADER.sql
var planCollaboratorGetByModelPlanIDLoaderSQL string

// PlanCollaboratorGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanCollaboratorGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanCollaborator, error) {

	var collabSlice []*models.PlanCollaborator

	stmt, err := s.db.PrepareNamed(planCollaboratorGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

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
func (s *Store) PlanCollaboratorCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	collaborator *models.PlanCollaborator,
) (*models.PlanCollaborator, error) {

	collaborator.ID = utilityUUID.ValueOrNewUUID(collaborator.ID)

	stmt, err := np.PrepareNamed(planCollaboratorCreateSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	collaborator.ModifiedBy = nil
	collaborator.ModifiedDts = nil

	err = stmt.Get(collaborator, collaborator)
	if err != nil {
		return nil, err
	}

	return collaborator, nil
}

// PlanCollaboratorUpdate updates the plan collaborator for a given id
func (s *Store) PlanCollaboratorUpdate(
	_ *zap.Logger,
	collaborator *models.PlanCollaborator,
) (*models.PlanCollaborator, error) {

	stmt, err := s.db.PrepareNamed(planCollaboratorUpdateSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(collaborator, collaborator)
	if err != nil {
		return nil, err
	}

	return collaborator, nil
}

// PlanCollaboratorDelete deletes the plan collaborator for a given id
func (s *Store) PlanCollaboratorDelete(
	_ *zap.Logger,
	id uuid.UUID,
	userID uuid.UUID,
) (*models.PlanCollaborator, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(planCollaboratorDeleteSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	collaborator := &models.PlanCollaborator{}
	err = stmt.Get(collaborator, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit collaborator delete transaction: %w", err)
	}

	return collaborator, nil
}

// PlanCollaboratorFetchByID returns a plan collaborator for a given database ID, or nil if none found
func (s *Store) PlanCollaboratorFetchByID(id uuid.UUID) (*models.PlanCollaborator, error) {

	stmt, err := s.db.PrepareNamed(planCollaboratorFetchByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var collaborator models.PlanCollaborator
	err = stmt.Get(&collaborator, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &collaborator, nil
}
