package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/plan_payments_create.sql
var planPaymentsCreateSQL string

//go:embed SQL/plan_payments_update.sql
var planPaymentsUpdateSQL string

//go:embed SQL/plan_payments_get_by_id.sql
var planPaymentsGetByIDSQL string

//go:embed SQL/plan_payments_get_by_model_plan_id.sql
var planPaymentsGetByModelPlanIDSQL string

// PlanPaymentsCreate creates a new plan payments row in the database and returns a copy to the caller
func (s *Store) PlanPaymentsCreate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {
	payments.ID = utilityUUID.ValueOrNewUUID(payments.ID)

	statement, err := s.db.PrepareNamed(planPaymentsCreateSQL)
	if err != nil {
		//TODO, implment struct
		return nil, err
		// return nil, genericmodel.HandleModelCreationError(logger, err, payments)
	}

	payments.ModifiedBy = nil
	payments.ModifiedDts = nil

	err = statement.Get(payments, payments)
	if err != nil {
		//TODO, implment struct
		return nil, err
		// return nil, genericmodel.HandleModelCreationError(logger, err, payments)
	}

	return payments, nil
}

// PlanPaymentsRead finds a plan payments model by id
func (s *Store) PlanPaymentsRead(
	_ *zap.Logger,
	id uuid.UUID) (*models.PlanPayments, error) {
	modelInstance := models.PlanPayments{}

	statement, err := s.db.PrepareNamed(planPaymentsGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&modelInstance, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &modelInstance, nil
}

// PlanPaymentsReadByModelPlan finds a plan payments model by model plan association
func (s *Store) PlanPaymentsReadByModelPlan(
	_ *zap.Logger,
	modelPlanID uuid.UUID) (*models.PlanPayments, error) {
	modelInstance := models.PlanPayments{}

	statement, err := s.db.PrepareNamed(planPaymentsGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&modelInstance, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))

	if err != nil {
		return nil, err
	}

	return &modelInstance, nil
}

// PlanPaymentsUpdate updates a plan payment model in the database
func (s *Store) PlanPaymentsUpdate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {
	statement, err := s.db.PrepareNamed(planPaymentsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, payments)
	}

	err = statement.Get(payments, payments)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, payments)
	}

	return payments, nil
}

/*func (s *Store) PlanPaymentsDelete(
	logger *zap.Logger,
	id uuid.UUID) (*models.PlanPayments, error) {
	return nil, nil
}*/
