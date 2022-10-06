package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/operational_need_and_possible_collection_get_by_model_plan_id.sql
var operationalNeedAndPossibleCollectionByModelPlanIDSQL string

//go:embed SQL/operational_need_collection_get_by_model_plan_id.sql
var operationalNeedCollectionByModelPlanIDSQL string

//go:embed SQL/operational_need_get_by_model_plan_id_and_type.sql
var operationalNeedGetByModelPlanIDAndTypeSQL string

//go:embed SQL/operational_need_insert_or_update.sql
var operationalNeedInsertOrUpdateSQL string

// OperationalNeedAndPossibleCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func (s *Store) OperationalNeedAndPossibleCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.OperationalNeed, error) {
	needs := []*models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(operationalNeedAndPossibleCollectionByModelPlanIDSQL)
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

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func (s *Store) OperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.OperationalNeed, error) {
	needs := []*models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(operationalNeedCollectionByModelPlanIDSQL)
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

// OperationalNeedGetByModelPlanIDAndType existing OperationalNeed associated to a model plan by id and type
func (s *Store) OperationalNeedGetByModelPlanIDAndType(logger *zap.Logger, modelPlanID uuid.UUID, needType models.OperationalNeedKey) (*models.OperationalNeed, error) {
	need := models.OperationalNeed{}

	stmt, err := s.db.PrepareNamed(operationalNeedGetByModelPlanIDAndTypeSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{

		"model_plan_id": modelPlanID,
		"need_type":     needType,
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

// OperationalNeedInsertOrUpdate either inserts or updates an operational need in the DB
func (s *Store) OperationalNeedInsertOrUpdate(logger *zap.Logger, need *models.OperationalNeed, needTypeKey models.OperationalNeedKey) (*models.OperationalNeed, error) {
	statement, err := s.db.PrepareNamed(operationalNeedInsertOrUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need)
	}
	need.ID = utilityUUID.ValueOrNewUUID(need.ID)
	need.NeedTypeShortName = needTypeKey // This will set the need type id IN the db

	err = statement.Get(need, need)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, need) //this could be either update or insert..
	}
	return need, err

}
