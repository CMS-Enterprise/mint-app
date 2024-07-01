package storage

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

// GetExistingModelLinkNamesByModelPlanIDAndFieldNameLOADER returns the plan GeneralCharacteristics for a slice of model plan ids and field Names
func (s *Store) GetExistingModelLinkNamesByModelPlanIDAndFieldNameLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.ExistingModelLinks, error) {

	var linkSlice []*models.ExistingModelLinks

	stmt, err := s.db.PrepareNamed(sqlqueries.ExistingModelLink.GetNamesByModelPlanIDAndFieldName)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&linkSlice, arg) //this returns more than one
	if err != nil {
		logger.Error("failed to get names of all model links by modelPlanID and field name", zap.Error(err))
		return nil, err
	}

	return linkSlice, nil
}

// ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.ExistingModelLink, error) {

	var linkSlice []*models.ExistingModelLink

	stmt, err := s.db.PrepareNamed(sqlqueries.ExistingModelLink.GetByModelPlanIDAndFieldNameLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&linkSlice, arg) //this returns more than one
	if err != nil {
		logger.Error("failed to get Model Links by modelPlanID", zap.Error(err))
		return nil, err
	}

	return linkSlice, nil
}

// ExistingModelLinksUpdate creates a new links that don't yet exist, deletes ones that are no longer provided,
func (s *Store) ExistingModelLinksUpdate(
	logger *zap.Logger,
	userID uuid.UUID,
	modelPlanID uuid.UUID,
	fieldName models.ExisitingModelLinkFieldType,
	existingModelIDs []int,
	currentModelPlanIDs []uuid.UUID,
) ([]*models.ExistingModelLink, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	currentModelPlanIDsArray := convertToStringArray(currentModelPlanIDs)
	existingModelIDsArray := convertIntToPQStringArray(existingModelIDs)
	arg := map[string]interface{}{
		"model_plan_id":          modelPlanID,
		"field_name":             fieldName,
		"current_model_plan_ids": currentModelPlanIDsArray,
		"existing_model_ids":     existingModelIDsArray,
		"created_by":             userID,
	}
	var linkSlice []*models.ExistingModelLink

	stmt, err := tx.PrepareNamed(sqlqueries.ExistingModelLink.Merge)
	if err != nil {
		logger.Error("failed to prepare Existing Model Links update query", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Select(&linkSlice, arg)
	if err != nil {
		logger.Error("failed to update Existing Model Links", zap.Error(err))
		return nil, err
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

	stmt, err := s.db.PrepareNamed(sqlqueries.ExistingModelLink.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&link, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, id)
	}
	return &link, nil
}
