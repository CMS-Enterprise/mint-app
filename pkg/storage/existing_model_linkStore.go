package storage

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/existing_model_link/create.sql
var existingModelLinkCreateSQL string

//go:embed SQL/existing_model_link/get_by_id.sql
var existingModelLinkGetByIDSQL string

//go:embed SQL/existing_model_link/delete.sql
var existingModelLinkDeleteSQL string

//go:embed SQL/existing_model_link/get_by_model_plan_id_LOADER.sql
var existingModelLinkGetByModelPlanIDLoaderSQL string

// ExistingModelLinkGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) ExistingModelLinkGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.ExistingModelLink, error) {
	linkSlice := []*models.ExistingModelLink{}

	stmt, err := s.db.PrepareNamed(existingModelLinkGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&linkSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return linkSlice, nil
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

// ExistingModelLinkGetByID returns an an existing model link by ID
func (s *Store) ExistingModelLinkGetByID(logger *zap.Logger, id uuid.UUID) (*models.ExistingModelLink, error) {
	link := models.ExistingModelLink{}

	statement, err := s.db.PrepareNamed(existingModelLinkGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&link, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &link, nil

}

// ExistingModelLinkDelete deletes an existing model link
func (s *Store) ExistingModelLinkDelete(logger *zap.Logger, id uuid.UUID) (*models.ExistingModelLink, error) {
	link := models.ExistingModelLink{}

	statement, err := s.db.PrepareNamed(existingModelLinkDeleteSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&link, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &link, nil

}
