package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/cms-enterprise/mint-app/pkg/models"

	_ "embed"
)

// PossibleOperationalNeedCollectionGetByModelPlanID returns possible operational
// needs that don't have an existing record for a model plan
func (s *Store) PossibleOperationalNeedCollectionGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) ([]*models.PossibleOperationalNeed, error) {

	var posNeeds []*models.PossibleOperationalNeed

	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalNeed.CollectionByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&posNeeds, arg) // This returns more than one

	if err != nil {
		return nil, err
	}
	return posNeeds, nil

}
