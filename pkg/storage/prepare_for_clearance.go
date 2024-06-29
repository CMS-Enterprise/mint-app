package storage

import (
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
)

// ReadyForClearanceGetByModelPlanID reads information about a model plan's clearance
func (s *Store) ReadyForClearanceGetByModelPlanID(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) (*models.PrepareForClearanceResponse, error) {

	dbResult := &models.PrepareForClearanceResponse{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PrepareForClearance.GetByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(dbResult, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))

	if err != nil {
		return nil, err
	}

	return dbResult, nil
}
