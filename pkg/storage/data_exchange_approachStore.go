package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/sqlutils"

	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

// DataExchangeApproachCreate creates a new data exchange approach row in the database and returns a copy to the caller
func (s *Store) DataExchangeApproachCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	dataExchangeApproach *models.DataExchangeApproach,
) (*models.DataExchangeApproach, error) {

	dataExchangeApproach.ID = utilityUUID.ValueOrNewUUID(dataExchangeApproach.ID)

	stmt, err := np.PrepareNamed(sqlqueries.DataExchangeApproach.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, dataExchangeApproach)
	}
	defer stmt.Close()

	err = stmt.Get(dataExchangeApproach, dataExchangeApproach)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, dataExchangeApproach)
	}

	return dataExchangeApproach, nil
}

// DataExchangeApproachGetByIDLOADER returns data exchange approaches for a slice of ids
func (s *Store) DataExchangeApproachGetByIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.DataExchangeApproach, error) {

	var dataExchangeSlice []*models.DataExchangeApproach

	stmt, err := s.db.PrepareNamed(sqlqueries.DataExchangeApproach.GetByIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&dataExchangeSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return dataExchangeSlice, nil
}

// DataExchangeApproachGetByModelPlanIDLOADER returns data exchange approaches for a slice of model plan ids
func (s *Store) DataExchangeApproachGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.DataExchangeApproach, error) {

	var dataExchangeSlice []*models.DataExchangeApproach

	stmt, err := s.db.PrepareNamed(sqlqueries.DataExchangeApproach.GetByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&dataExchangeSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return dataExchangeSlice, nil
}

// DataExchangeApproachUpdate updates the data exchange approach for a given id
func (s *Store) DataExchangeApproachUpdate(
	logger *zap.Logger,
	dataExchangeApproach *models.DataExchangeApproach,
) (*models.DataExchangeApproach, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.DataExchangeApproach.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, dataExchangeApproach)
	}
	defer stmt.Close()

	err = stmt.Get(dataExchangeApproach, dataExchangeApproach)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, dataExchangeApproach)
	}

	return dataExchangeApproach, nil
}
