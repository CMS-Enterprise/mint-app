package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/existing_model/collection_get.sql
var existingModelCollectionGetSQL string

// ExistingModelCollectionGet returns a list of existing models
func (s *Store) ExistingModelCollectionGet(logger *zap.Logger) ([]*models.ExistingModel, error) {
	existingModels := []*models.ExistingModel{}
	stmt, err := s.db.PrepareNamed(existingModelCollectionGetSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{}

	err = stmt.Select(&existingModels, arg)
	if err != nil {
		return nil, err
	}
	return existingModels, nil

}
