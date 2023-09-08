package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/operational_need/collection_get_by_model_plan_id.sql
var operationalNeedCollectionByModelPlanIDSQL string

//go:embed SQL/operational_need/collection_get_by_model_plan_id_LOADER.sql
var operationalNeedCollectionByModelPlanIDLOADERSQL string

//go:embed SQL/operational_need/get_by_model_plan_id_and_type.sql
var operationalNeedGetByModelPlanIDAndTypeSQL string

//go:embed SQL/operational_need/get_by_model_plan_id_and_other_type.sql
var operationalNeedGetByModelPlanIDAndOtherTypeSQL string

//go:embed SQL/operational_need/get_by_id.sql
var operationalNeedGetByIDSQL string

//go:embed SQL/operational_need/update_by_id.sql
var operationalNeedUpdateByIDSQL string

//go:embed SQL/operational_need/insert_or_update.sql
var operationalNeedInsertOrUpdateSQL string

//go:embed SQL/operational_need/insert_all_possible.sql
var operationalNeedInsertAllPossibleSQL string

//go:embed SQL/operational_need/insert_or_update_other.sql
var operationalNeedInsertOrUpdateOtherSQL string

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func (s *Store) OperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.OperationalNeed, error) {
	needs := []*models.OperationalNeed{}

	stmt, err := s.statements.Get(operationalNeedCollectionByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

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
func (s *Store) OperationalNeedCollectionGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.OperationalNeed, error) {
	needs := []*models.OperationalNeed{}

	stmt, err := s.statements.Get(operationalNeedCollectionByModelPlanIDLOADERSQL)
	if err != nil {
		return nil, err
	}

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
func (s *Store) OperationalNeedGetByModelPlanIDAndType(logger *zap.Logger, modelPlanID uuid.UUID, needKey models.OperationalNeedKey) (*models.OperationalNeed, error) {
	need := models.OperationalNeed{}

	stmt, err := s.statements.Get(operationalNeedGetByModelPlanIDAndTypeSQL)
	if err != nil {
		return nil, err
	}

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
func (s *Store) OperationalNeedGetByModelPlanIDAndOtherType(logger *zap.Logger, modelPlanID uuid.UUID, customNeedType string) (*models.OperationalNeed, error) {
	need := models.OperationalNeed{}

	stmt, err := s.statements.Get(operationalNeedGetByModelPlanIDAndOtherTypeSQL)
	if err != nil {
		return nil, err
	}

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

// OperationalNeedGetByID returns an Operational Need by it's ID
func (s *Store) OperationalNeedGetByID(logger *zap.Logger, id uuid.UUID) (*models.OperationalNeed, error) {
	need := models.OperationalNeed{}

	stmt, err := s.statements.Get(operationalNeedGetByIDSQL)
	if err != nil {
		return nil, err
	}

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
func (s *Store) OperationalNeedInsertOrUpdate(logger *zap.Logger, need *models.OperationalNeed, needTypeKey models.OperationalNeedKey) (*models.OperationalNeed, error) {
	statement, err := s.statements.Get(operationalNeedInsertOrUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	need.ID = utilityUUID.ValueOrNewUUID(need.ID)
	need.Key = &needTypeKey // This will set the need type id IN the db

	err = statement.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err

}

// OperationalNeedInsertOrUpdateOther either inserts or updates a custom operational need in the DB
func (s *Store) OperationalNeedInsertOrUpdateOther(logger *zap.Logger, need *models.OperationalNeed, customNeedType string) (*models.OperationalNeed, error) {
	statement, err := s.statements.Get(operationalNeedInsertOrUpdateOtherSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	need.ID = utilityUUID.ValueOrNewUUID(need.ID)
	need.NameOther = &customNeedType // This will set the need type id IN the db

	err = statement.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err

}

// OperationalNeedUpdateByID will update an operational need in the DB
func (s *Store) OperationalNeedUpdateByID(logger *zap.Logger, need *models.OperationalNeed) (*models.OperationalNeed, error) {
	statement, err := s.statements.Get(operationalNeedUpdateByIDSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}

	err = statement.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err

}

// OperationalNeedInsertAllPossible will insert all possible operational need in the DB for a specific model pland
func (s *Store) OperationalNeedInsertAllPossible(logger *zap.Logger, modelPlanID uuid.UUID, createdBy uuid.UUID) ([]*models.OperationalNeed, error) {

	needs := []*models.OperationalNeed{}
	statement, err := s.statements.Get(operationalNeedInsertAllPossibleSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{

		"model_plan_id": modelPlanID,
		"created_by":    createdBy,
	}

	err = statement.Select(&needs, arg)
	if err != nil {
		return nil, err
	}
	return needs, err

}
