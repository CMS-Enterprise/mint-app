package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

// ExistingModelGetByIDLOADER returns the existing model for a slice of model plan ids
func (s *Store) ExistingModelGetByIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.ExistingModel, error) {

	var eMSlice []*models.ExistingModel

	stmt, err := s.db.PrepareNamed(sqlqueries.ExistingModel.GetByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&eMSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return eMSlice, nil
}

// ExistingModelCollectionGet returns a list of existing models
func (s *Store) ExistingModelCollectionGet(_ *zap.Logger) ([]*models.ExistingModel, error) {

	var existingModels []*models.ExistingModel
	stmt, err := s.db.PrepareNamed(sqlqueries.ExistingModel.CollectionGet)

	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{}

	err = stmt.Select(&existingModels, arg)
	if err != nil {
		return nil, err
	}

	return existingModels, nil
}
