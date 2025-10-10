package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOTemplateSolutionGetByIDLoader returns template solutions by ID
func MTOTemplateSolutionGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateSolution](np, sqlqueries.MTOTemplateSolution.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateSolutionGetByTemplateIDLoader returns template solutions by template ID
func MTOTemplateSolutionGetByTemplateIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, templateIDs []uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	args := map[string]interface{}{
		"template_ids": pq.Array(templateIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateSolution](np, sqlqueries.MTOTemplateSolution.GetByTemplateIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// Add to mto_template_solution.go
func MTOTemplateSolutionGetByMilestoneIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, milestoneIDs []uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	args := map[string]interface{}{
		"milestone_ids": pq.Array(milestoneIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateSolution](np, sqlqueries.MTOTemplateSolution.GetByMilestoneIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}
