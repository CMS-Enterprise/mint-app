package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/cms-enterprise/mint-app/pkg/models"

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
