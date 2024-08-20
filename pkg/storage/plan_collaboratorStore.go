package storage

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/utilitysql"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityuuid"
)

// PlanCollaboratorGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanCollaboratorGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanCollaborator, error) {

	var collabSlice []*models.PlanCollaborator
	stmt, err := s.db.PrepareNamed(sqlqueries.PlanCollaborator.CollectionGetByModelPlanIDLoader)
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

// PlanCollaboratorGetIDLOADER returns the plan collaborators corresponding to an array of plan collaborator IDs stored in JSON array
func PlanCollaboratorGetIDLOADER(
	np sqlutils.NamedPreparer,
	paramTableJSON string,
) ([]*models.PlanCollaborator, error) {
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	retCollaborators, err := sqlutils.SelectProcedure[models.PlanCollaborator](np, sqlqueries.PlanCollaborator.CollectionGetByIDLoader, arg)
	if err != nil {
		return nil, fmt.Errorf("issue selecting plan collaborators by ids with the data loader, %w", err)
	}

	return retCollaborators, nil
}

// PlanCollaboratorCreate creates a new plan collaborator
func (s *Store) PlanCollaboratorCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	collaborator *models.PlanCollaborator,
) (*models.PlanCollaborator, error) {

	collaborator.ID = utilityuuid.ValueOrNewUUID(collaborator.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanCollaborator.Create)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanCollaborator.Update)
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

	stmt, err := tx.PrepareNamed(sqlqueries.PlanCollaborator.Delete)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	collaborator := &models.PlanCollaborator{}
	err = stmt.Get(collaborator, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit collaborator delete transaction: %w", err)
	}

	return collaborator, nil
}

// PlanCollaboratorGetByID returns a plan collaborator for a given database ID, or nil if none found
// Note: The dataloader method should be preferred over this method.
func (s *Store) PlanCollaboratorGetByID(id uuid.UUID) (*models.PlanCollaborator, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanCollaborator.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var collaborator models.PlanCollaborator
	err = stmt.Get(&collaborator, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &collaborator, nil
}

// PlanCollaboratorGetCountByUserID returns the number of plan collaborators for a given user_id
func (s *Store) PlanCollaboratorGetCountByUserID(userID uuid.UUID) (int, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanCollaborator.GetCountByUserID)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	arg := utilitysql.CreateUserIDQueryMap(userID)

	var count int
	err = stmt.Get(&count, arg)
	if err != nil {
		return 0, err
	}

	return count, nil
}

// PlanCollaboratorGetByModelPlanID returns a slice of plan collaborators corresponding with a model plan id
func (s *Store) PlanCollaboratorGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) ([]*models.PlanCollaborator, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)

	retCollaborators, err := sqlutils.SelectProcedure[models.PlanCollaborator](s, sqlqueries.PlanCollaborator.CollectionGetByModelPlanID, arg)
	if err != nil {
		return nil, fmt.Errorf("issue selecting plan collaborators by model plan id, %w", err)
	}

	return retCollaborators, nil
}
