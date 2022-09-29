package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/operational_need_collection_get_by_model_plan_id.sql
var operationalNeedCollectionByModelPlanIDSQL string

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
