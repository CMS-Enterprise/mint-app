package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/existing_model/collection_get.sql
var existingModelCollectionGetSQL string

//go:embed SQL/existing_model/get_by_id_LOADER.sql
var existingModelGetByModelPlanIDLoaderSQL string

// ExistingModelGetByIDLOADER returns the existing model for a slice of model plan ids
func (s *Store) ExistingModelGetByIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.ExistingModel, error) {

	var eMSlice []*models.ExistingModel
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&eMSlice, existingModelGetByModelPlanIDLoaderSQL, arg)

	if err != nil {
		return nil, err
	}

	return eMSlice, nil
}

// ExistingModelCollectionGet returns a list of existing models
func (s *Store) ExistingModelCollectionGet(_ *zap.Logger) ([]*models.ExistingModel, error) {

	var existingModels []*models.ExistingModel

	err := s.db.Select(&existingModels, existingModelCollectionGetSQL)
	if err != nil {
		return nil, err
	}
	return existingModels, nil
}
