package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/possible_operational_need/collection_get_by_model_plan_id.sql
var possibleOperationalNeedCollectionByModelPlanIDSQL string

// PossibleOperationalNeedCollectionGetByModelPlanID returns possible operational
// needs that don't have an existing record for a model plan
func (s *Store) PossibleOperationalNeedCollectionGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) ([]*models.PossibleOperationalNeed, error) {

	var posNeeds []*models.PossibleOperationalNeed
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	// This returns more than one
	err := s.db.Select(&posNeeds, possibleOperationalNeedCollectionByModelPlanIDSQL, arg)

	if err != nil {
		return nil, err
	}
	return posNeeds, nil

}
