package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"

	_ "embed"
)

//go:embed SQL/existing_model/collection_get.sql
var existingModelCollectionGetSQL string

//go:embed SQL/existing_model/get_by_id_LOADER.sql
var existingModelGetByModelPlanIDLoaderSQL string

//go:embed SQL/existing_model/get_by_id.sql
var existingModelGetByByIDSQL string

// Changes: Move this to the sql queries package

// ExistingModelGetByIDLOADER returns the existing model for a slice of model plan ids
func (s *Store) ExistingModelGetByIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.ExistingModel, error) {

	var eMSlice []*models.ExistingModel

	stmt, err := s.db.PrepareNamed(existingModelGetByModelPlanIDLoaderSQL)
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
	stmt, err := s.db.PrepareNamed(existingModelCollectionGetSQL)

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

// ExistingModelGetByID returns the existing model for a single model plan id
func ExistingModelGetByID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	id int,
) (*models.ExistingModel, error) {

	arg := map[string]interface{}{
		"id": id,
	}
	existingModel, err := sqlutils.GetProcedure[models.ExistingModel](np, existingModelGetByByIDSQL, arg)
	if err != nil {
		return nil, err
	}

	return existingModel, nil
}
