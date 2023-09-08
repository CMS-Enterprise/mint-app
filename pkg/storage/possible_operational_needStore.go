package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/possible_operational_need/collection_get_by_model_plan_id.sql
var possibleOperationalNeedCollectionByModelPlanIDSQL string

// PossibleOperationalNeedCollectionGetByModelPlanID returns possible operational needs that don't have an existing record for a model plan
func (s *Store) PossibleOperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.PossibleOperationalNeed, error) {

	posNeeds := []*models.PossibleOperationalNeed{}

	stmt, err := s.statements.Get(possibleOperationalNeedCollectionByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&posNeeds, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return posNeeds, nil

}
