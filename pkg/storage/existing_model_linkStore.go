package storage

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"

	_ "embed"
)

//go:embed SQL/existing_model_link/merge.sql
var existingModelLinkMergeSQL string

//go:embed SQL/existing_model_link/get_by_id.sql
var existingModelLinkGetByIDSQL string

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

// ExistingModelLinksUpdate creates a new links that don't yet exist, deletes ones that are no longer provided,
func (s *Store) ExistingModelLinksUpdate(logger *zap.Logger, userID uuid.UUID, modelPlanID uuid.UUID, existingModelIDs []int, currentModelPlanIDs []uuid.UUID) ([]*models.ExistingModelLink, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()
	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}
	// existingIDs := convertToStringArray(existingModelIDs)
	currentModelPlanIDsArray := convertToStringArray(currentModelPlanIDs)
	existingModelIDsArray := convertIntToPQStringArray(existingModelIDs)
	arg := map[string]interface{}{
		"model_plan_id":          modelPlanID,
		"current_model_plan_ids": currentModelPlanIDsArray,
		"existing_model_ids":     existingModelIDsArray,
		"created_by":             userID,
	}
	linkSlice := []*models.ExistingModelLink{}
	statement, err := tx.PrepareNamed(existingModelLinkMergeSQL)
	if err != nil {
		return nil, err //TODO: revisit error handling
	}

	err = statement.Select(&linkSlice, arg)
	if err != nil {
		return nil, err //TODO: revisit error handling
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}
	return linkSlice, nil

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
