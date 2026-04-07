package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonMilestoneGetByModelPlanIDLoader returns all common milestones, with the context of the model plan id to determine if it was added or not
// if model plan id is null, contextual data will show up as false (is_added, is_suggested)
func MTOCommonMilestoneGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonMilestoneGetByIDLoader returns all common milestones for a slice of milestone IDs
func MTOCommonMilestoneGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonMilestoneArchive marks a common milestone as archived and updates audit fields.
func MTOCommonMilestoneArchive(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID, actorUserID uuid.UUID) (*models.MTOCommonMilestone, error) {
	args := map[string]any{
		"id":          id,
		"modified_by": actorUserID,
	}

	returned, err := sqlutils.GetProcedure[models.MTOCommonMilestone](np, sqlqueries.MTOCommonMilestone.Archive, args)
	if err != nil {
		return nil, fmt.Errorf("issue archiving MTOCommonMilestone object: %w", err)
	}

	return returned, nil
}
