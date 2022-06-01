package storage

import (
	"database/sql"
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_milestones_create.sql
var planMilestonesCreateSQL string

//go:embed SQL/plan_milestones_update.sql
var planMilestonesUpdateSQL string

//go:embed SQL/plan_milestones_get_by_id.sql
var planMilestonesGetByIDSQL string

//go:embed SQL/plan_milestones_get_by_model_plan_id.sql
var planMilestonesGetByModelPlanIDSQL string

//go:embed SQL/plan_milestones_delete_by_id.sql
var planMilestonesDeleteByIDSQL string

// PlanMilestonesCreate creates a plan milestones object
func (s *Store) PlanMilestonesCreate(logger *zap.Logger, milestones *models.PlanMilestones) (*models.PlanMilestones, error) {
	milestones.ID = utilityUUID.ValueOrNewUUID(milestones.ID)

	statement, err := s.db.PrepareNamed(planMilestonesCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, milestones)
	}

	milestones.ModifiedBy = nil
	milestones.ModifiedDts = nil

	err = statement.Get(milestones, milestones)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, milestones)
	}

	return milestones, nil
}

// PlanMilestonesUpdate updates a plan milestones object
func (s *Store) PlanMilestonesUpdate(logger *zap.Logger, plan *models.PlanMilestones) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, plan)
	}

	return plan, nil
}

// FetchPlanMilestonesByModelPlanID fetches a plan milestones object by a model plan id
func (s *Store) FetchPlanMilestonesByModelPlanID(logger *zap.Logger, principal *string, modelPlanID uuid.UUID) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	args := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	var plan models.PlanMilestones
	err = statement.Get(&plan, args)
	if err != nil {
		return nil, err
	}

	return &plan, nil
}

// FetchPlanMilestonesByID fetches a plan milestones object by id
func (s *Store) FetchPlanMilestonesByID(logger *zap.Logger, id uuid.UUID) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesGetByIDSQL)
	if err != nil {
		return nil, err
	}

	var plan models.PlanMilestones
	err = statement.Get(&plan, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &plan, nil
}

// DeletePlanMilestonesByID deletes a plan milestones object by id
func (s *Store) DeletePlanMilestonesByID(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	statement, err := s.db.PrepareNamed(planMilestonesDeleteByIDSQL)
	if err != nil {
		return nil, err
	}

	sqlResult, err := statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil
}
