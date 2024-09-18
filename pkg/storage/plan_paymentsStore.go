package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// PlanPaymentsGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanPaymentsGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanPayments, error) {

	var paySlice []*models.PlanPayments

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanPayments.GetByModelPlanIDLoader)
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
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {

	payments.ID = utilityuuid.ValueOrNewUUID(payments.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanPayments.Create)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanPayments.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&modelInstance, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &modelInstance, nil
}

// PlanPaymentsUpdate updates a plan payment model in the database
func (s *Store) PlanPaymentsUpdate(
	logger *zap.Logger,
	payments *models.PlanPayments) (*models.PlanPayments, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanPayments.Update)
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
