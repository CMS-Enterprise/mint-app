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
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanPayments, error) {

	var paySlice []*models.PlanPayments

	stmt, err := s.db.PrepareNamed(planPaymentsGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&paySlice, arg) // This returns more than one
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

	stmt, err := s.db.PrepareNamed(planPaymentsCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, payments)
	}
	defer stmt.Close()

	payments.ModifiedBy = nil
	payments.ModifiedDts = nil

	err = stmt.Get(payments, payments)
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

	stmt, err := s.db.PrepareNamed(planPaymentsGetByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&modelInstance, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &modelInstance, nil
}

// PlanPaymentsUpdate updates a plan payment model in the database
func (s *Store) PlanPaymentsUpdate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {

	stmt, err := s.db.PrepareNamed(planPaymentsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, payments)
	}
	defer stmt.Close()

	err = stmt.Get(payments, payments)
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
