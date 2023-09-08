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

//go:embed SQL/plan_payments/create.sql
var planPaymentsCreateSQL string

//go:embed SQL/plan_payments/update.sql
var planPaymentsUpdateSQL string

//go:embed SQL/plan_payments/get_by_id.sql
var planPaymentsGetByIDSQL string

//go:embed SQL/plan_payments/get_by_model_plan_id_LOADER.sql
var planPaymentsGetByModelPlanIDLoaderSQL string

// PlanPaymentsGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanPaymentsGetByModelPlanIDLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanPayments, error) {

	var paySlice []*models.PlanPayments
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&paySlice, planPaymentsGetByModelPlanIDLoaderSQL, arg)
	if err != nil {
		return nil, err
	}

	return paySlice, nil
}

// PlanPaymentsCreate creates a new plan payments row in the database and returns a copy to the caller
func (s *Store) PlanPaymentsCreate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {

	payments.ID = utilityUUID.ValueOrNewUUID(payments.ID)
	payments.ModifiedBy = nil
	payments.ModifiedDts = nil

	err := s.db.Get(payments, planPaymentsCreateSQL, payments)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, payments)
	}

	return payments, nil
}

// PlanPaymentsRead finds a plan payments model by id
func (s *Store) PlanPaymentsRead(
	_ *zap.Logger,
	id uuid.UUID) (*models.PlanPayments, error) {
	modelInstance := models.PlanPayments{}

	err := s.db.Get(&modelInstance, planPaymentsGetByIDSQL, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &modelInstance, nil
}

// PlanPaymentsUpdate updates a plan payment model in the database
func (s *Store) PlanPaymentsUpdate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {

	err := s.db.Get(payments, planPaymentsUpdateSQL, payments)
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
