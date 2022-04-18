package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utility_sql"
	"github.com/cmsgov/mint-app/pkg/shared/utility_uuid"
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

//go:embed SQL/plan_milestones_get_by_model_plan_id.sql
var planMilestonesGetByModelPlan_IdSQL string

func (s *Store) PlanMilestonesCreate(logger *zap.Logger, milestones *models.PlanMilestones) (*models.PlanMilestones, error) {
	milestones.ID = utility_uuid.ValueOrNewUUID(milestones.ID)

	statement, err := s.db.PrepareNamed(planMilestonesCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, milestones)
	}

	err = statement.Get(milestones, milestones)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, milestones)
	}

	return milestones, nil
}

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

func (s *Store) PlanMilestonesGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesGetByIdSQL)
	if err != nil {
		return nil, err
	}

	var plan models.PlanMilestones
	err = statement.Get(&plan, utility_sql.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, id)
	}

	return &plan, nil
}

func (s *Store) PlanMilestonesGetByModelPlanID(logger *zap.Logger, principal *string, modelPlanId uuid.UUID) (*models.PlanMilestones, error) {
	statement, err := s.db.PrepareNamed(planMilestonesGetByModelPlan_IdSQL)

	args := map[string]interface{}{
		"modified_by":   principal,
		"created_by":    principal,
		"model_plan_id": modelPlanId,
	}

	var plan models.PlanMilestones
	err = statement.Get(&plan, args)
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, modelPlanId)
	}

	return &plan, nil
}
