package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utility_sql"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/plan_basics_create.sql
var planBasicsCreateSQL string

//go:embed SQL/plan_basics_update.sql
var planBasicsUpdateSQL string

//go:embed SQL/plan_basics_get_by_id.sql
var planBasicsGetByIdSQL string

func (s *Store) PlanBasicsCreate(logger *zap.Logger, plan *models.PlanBasics) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsCreateSQL)
	if err != nil {
		result, err := genericmodel.HandleModelCreationError(logger, err, plan)
		return result.(*models.PlanBasics), err
	}

	err = statement.Get(plan, utility_sql.CreateIDQueryMap(plan.ID))
	if err != nil {
		result, err := genericmodel.HandleModelCreationError(logger, err, plan)
		return result.(*models.PlanBasics), err
	}

	return plan, nil
}

func (s *Store) PlanBasicsUpdate(logger *zap.Logger, plan *models.PlanBasics) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsUpdateSQL)
	if err != nil {
		result, err := genericmodel.HandleModelUpdateError(logger, err, plan)
		return result.(*models.PlanBasics), err
	}

	err = statement.Get(plan, plan)
	if err != nil {
		result, err := genericmodel.HandleModelQueryError(logger, err, plan)
		return result.(*models.PlanBasics), err
	}

	return plan, nil
}

func (s *Store) PlanBasicsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanBasics, error) {
	plan := models.PlanBasics{}

	statement, err := s.db.PrepareNamed(planBasicsGetByIdSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&plan, utility_sql.CreateIDQueryMap(id))

	if err != nil {
		result, err := genericmodel.HandleModelFetchError(logger, err, plan)
		return result.(*models.PlanBasics), err
	}

	return &plan, nil
}
