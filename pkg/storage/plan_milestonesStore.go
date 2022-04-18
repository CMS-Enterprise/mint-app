package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utility_sql"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/plan_milestones_create.sql
var planMilestonesCreateSQL string

//go:embed SQL/plan_milestones_update.sql
var planMilestonesUpdateSQL string

//go:embed SQL/plan_milestones_get_by_id.sql
var planMilestonesGetByIdSQL string

func (s *Store) PlanMilestonesCreate(logger *zap.Logger, plan *models.PlanMilestones) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesCreateSQL)
	if err != nil {
		result, err := genericmodel.HandleModelCreationError(logger, err, plan)
		return result.(*models.PlanMilestones), err
	}

	err = statement.Get(plan, utility_sql.CreateIDQueryMap(plan.ID))
	if err != nil {
		result, err := genericmodel.HandleModelCreationError(logger, err, plan)
		return result.(*models.PlanMilestones), err
	}

	return plan, nil
}

func (s *Store) PlanMilestonesUpdate(logger *zap.Logger, plan *models.PlanMilestones) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesUpdateSQL)
	if err != nil {
		result, err := genericmodel.HandleModelUpdateError(logger, err, plan)
		return result.(*models.PlanMilestones), err
	}

	err = statement.Get(plan, utility_sql.CreateIDQueryMap(plan.ID))
	if err != nil {
		result, err := genericmodel.HandleModelQueryError(logger, err, plan)
		return result.(*models.PlanMilestones), err
	}

	return plan, nil
}

func (s *Store) PlanMilestonesGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanMilestones, error) {
	plan := models.PlanMilestones{}

	statement, err := s.db.PrepareNamed(planMilestonesGetByIdSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&plan, utility_sql.CreateIDQueryMap(id))
	if err != nil {
		result, err := genericmodel.HandleModelFetchError(logger, err, plan)
		return result.(*models.PlanMilestones), err
	}

	return &plan, nil
}
