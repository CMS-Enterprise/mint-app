package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func (s *Store) OperationalNeedCollectionGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) ([]*models.OperationalNeed, error) {

	var needs []*models.OperationalNeed

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.CollectionByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&needs, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return needs, nil
}

// OperationalNeedCollectionGetByModelPlanIDLOADER returns OperationalNeeds utilizing a Data Loader
func (s *Store) OperationalNeedCollectionGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.OperationalNeed, error) {

	var needs []*models.OperationalNeed

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.CollectionByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}
	err = stmt.Select(&needs, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return needs, nil
}

// OperationalNeedGetByModelPlanIDAndType existing OperationalNeed associated to a model plan by id and type
func (s *Store) OperationalNeedGetByModelPlanIDAndType(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	needKey models.OperationalNeedKey,
) (*models.OperationalNeed, error) {

	need := models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.GetByModelPlanIDAndType)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"need_key":      needKey,
	}

	err = stmt.Get(&need, arg)

	if err != nil {
		if err != nil {
			if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
				return nil, nil
			}
		}
		return nil, err
	}
	return &need, nil
}

// OperationalNeedGetByModelPlanIDAndOtherType existing OperationalNeed associated to a model plan by id and custom type
func (s *Store) OperationalNeedGetByModelPlanIDAndOtherType(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	customNeedType string,
) (*models.OperationalNeed, error) {

	need := models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.GetByModelPlanIDAndOtherType)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"name_other":    customNeedType,
	}

	err = stmt.Get(&need, arg)
	if err != nil {
		if err != nil {
			if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
				return nil, nil
			}
		}
		return nil, err
	}
	return &need, nil
}

// OperationalNeedGetByID returns an Operational Need by its ID
func (s *Store) OperationalNeedGetByID(_ *zap.Logger, id uuid.UUID) (*models.OperationalNeed, error) {

	need := models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	err = stmt.Get(&need, arg)
	if err != nil {
		return nil, err
	}

	return &need, nil
}

// OperationalNeedInsertOrUpdate either inserts or updates an operational need in the DB
func (s *Store) OperationalNeedInsertOrUpdate(
	logger *zap.Logger,
	need *models.OperationalNeed,
	needTypeKey models.OperationalNeedKey,
) (*models.OperationalNeed, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.InsertOrUpdate)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	defer stmt.Close()

	need.ID = utilityuuid.ValueOrNewUUID(need.ID)
	need.Key = &needTypeKey // This will set the need type id IN the db

	err = stmt.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err
}

// OperationalNeedInsertOrUpdateOther either inserts or updates a custom operational need in the DB
func (s *Store) OperationalNeedInsertOrUpdateOther(
	logger *zap.Logger,
	need *models.OperationalNeed,
	customNeedType string,
) (*models.OperationalNeed, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.InsertOrUpdateOther)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	defer stmt.Close()

	need.ID = utilityuuid.ValueOrNewUUID(need.ID)
	need.NameOther = &customNeedType // This will set the need type id IN the db

	err = stmt.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err

}

// OperationalNeedUpdateByID will update an operational need in the DB
func (s *Store) OperationalNeedUpdateByID(
	logger *zap.Logger,
	need *models.OperationalNeed,
) (*models.OperationalNeed, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalNeed.UpdateByID)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	defer stmt.Close()

	err = stmt.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err
}

// OperationalNeedInsertAllPossible will insert all possible operational need in the DB for a specific model pland
func (s *Store) OperationalNeedInsertAllPossible(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	createdBy uuid.UUID,
) ([]*models.OperationalNeed, error) {

	var needs []*models.OperationalNeed
	stmt, err := np.PrepareNamed(sqlqueries.OperationalNeed.InsertAllPossible)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{

		"model_plan_id": modelPlanID,
		"created_by":    createdBy,
	}

	err = stmt.Select(&needs, arg)
	if err != nil {
		return nil, err
	}

	return needs, err
}
