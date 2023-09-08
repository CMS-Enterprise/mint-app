package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
)

//go:embed SQL/prepare_for_clearance/get_by_model_plan_id.sql
var prepareForClearanceGetByModelPlanID string

// ReadyForClearanceGetByModelPlanID reads information about a model plan's clearance
func (s *Store) ReadyForClearanceGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) (*models.PrepareForClearanceResponse, error) {

	dbResult := &models.PrepareForClearanceResponse{}

	err := s.db.Get(dbResult, prepareForClearanceGetByModelPlanID, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, err
	}

	return dbResult, nil
}
