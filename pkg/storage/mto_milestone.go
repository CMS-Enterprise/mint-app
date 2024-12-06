package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOMilestoneGetByIDLoader returns all milestones by the provided ids
func MTOMilestoneGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOMilestone, error) {

	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOMilestoneGetByModelPlanIDLoader returns all top level categories for a slice of model plan ids
func MTOMilestoneGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOMilestone, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOMilestoneGetByModelPlanIDAndCategoryIDLoader returns  mto milestones that are associated with a model plan id and category
func MTOMilestoneGetByModelPlanIDAndCategoryIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []MTOMilestoneByModelPlanAndCategoryKey) ([]*models.MTOMilestone, error) {

	jsonParam, err := models.StructArrayToJSONArray(keys)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"paramTableJSON": jsonParam,
	}

	returned, err := sqlutils.SelectProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.GetByModelPlanIDAndCategoryIDLoader, arg)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOMilestoneCreate creates a new MTOMilestone in the database
//
// NOTE: This method is used for creating both Custom and Library-sourced (Common) milestones. It WILL return an error
// if you try to create one that has both custom info (like a `name`) and a CommonMilestoneKey
// This is controlled not by application code, but by constraints initially added in this migration: migrations/V185__Add_MTO_Milestone.sql
func MTOMilestoneCreate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOMilestone *models.MTOMilestone) (*models.MTOMilestone, error) {
	if MTOMilestone.ID == uuid.Nil {
		MTOMilestone.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.Create, MTOMilestone)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOMilestone object: %w", procErr)
	}
	return returned, nil
}

// MTOMilestoneUpdate updates a new MTOMilestone in the database
//
// NOTE: This method is used for updating both Custom and Library-sourced (Common) milestones. It WILL return an error
// if you try to update one that has both custom info (like a `name`) and a CommonMilestoneKey
// This is controlled not by application code, but by constraints initially added in this migration: migrations/V185__Add_MTO_Milestone.sql
func MTOMilestoneUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOMilestone *models.MTOMilestone) (*models.MTOMilestone, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.Update, MTOMilestone)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOMilestone object: %w", procErr)
	}
	return returned, nil
}

// MTOMilestoneDelete deletes an MTOMilestone in the database
func MTOMilestoneDelete(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, milestoneID uuid.UUID) error {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return err
	}

	// Delete the milestone!
	// `ON CASCADE` functionality will delete any Milestone<->Solution links, if present
	arg := map[string]interface{}{"id": milestoneID}
	procErr := sqlutils.ExecProcedure(tx, sqlqueries.MTOMilestone.Delete, arg)
	if procErr != nil {
		return fmt.Errorf("issue deleting MTOMilestone object: %w", procErr)
	}
	return nil
}

// MTOMilestoneGetByID returns an existing MTOMilestone from the database
func MTOMilestoneGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOMilestone, error) {

	arg := map[string]interface{}{"id": id}

	returned, procErr := sqlutils.GetProcedure[models.MTOMilestone](np, sqlqueries.MTOMilestone.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving MTOMilestone: %w", procErr)
	}

	return returned, nil
}
