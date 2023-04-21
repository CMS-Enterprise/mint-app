package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/existing_model_link/collection_get_by_model_plan_id.sql
var existingModelLinkCollectionGetSQL string

//go:embed SQL/existing_model_link/create.sql
var existingModelLinkCreateSQL string

// ExistingModelLinkCollectionGetByModelPlanID returns a list of existing models links by model plan Id
func (s *Store) ExistingModelLinkCollectionGetByModelPlanID(logger *zap.Logger) ([]*models.ExistingModelLink, error) {
	existingModels := []*models.ExistingModelLink{}
	stmt, err := s.db.PrepareNamed(existingModelLinkCollectionGetSQL)
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

// ExistingModelLinkCreate creates a new link for an existing model
func (s *Store) ExistingModelLinkCreate(logger *zap.Logger, link *models.ExistingModelLink) (*models.ExistingModelLink, error) {
	link.ID = utilityUUID.ValueOrNewUUID(link.ID)
	statement, err := s.db.PrepareNamed(existingModelLinkCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, link)
	}
	newlink := models.ExistingModelLink{}
	err = statement.Get(newlink, link)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, link)
	}
	return &newlink, nil

}
