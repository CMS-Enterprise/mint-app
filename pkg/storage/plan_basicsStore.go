package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/models"
	utilityUuid "github.com/cmsgov/mint-app/pkg/shared/uuid"
	"github.com/cmsgov/mint-app/pkg/storage/planbasics"
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
	plan.ID = utilityUuid.ValueOrNewUUID(plan.ID)

	statement, err := s.db.PrepareNamed(planBasicsCreateSQL)
	if err != nil {
		return planbasics.HandleModelCreationError(logger, plan, err)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return planbasics.HandleModelCreationError(logger, plan, err)
	}

	return plan, nil
}

func (s *Store) PlanBasicsUpdate(logger *zap.Logger, plan *models.PlanBasics) (*models.PlanBasics, error) {
	statement, err := s.db.PrepareNamed(planBasicsUpdateSQL)
	if err != nil {
		return planbasics.HandleModelUpdateError(logger, plan, err, false)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return planbasics.HandleModelUpdateError(logger, plan, err, true)
	}

	return plan, nil
}

func (s *Store) PlanBasicsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanBasics, error) {
	plan := models.PlanBasics{}

	statement, err := s.db.PrepareNamed(planBasicsGetByIdSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{"id": id}
	err = statement.Get(&plan, arg)

	if err != nil {
		return planbasics.HandleModelFetchError(logger, id, err)
	}

	return &plan, nil
}
