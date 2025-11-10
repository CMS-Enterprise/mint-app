package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOTemplateMilestoneGetByIDLoader returns template milestones by ID
func MTOTemplateMilestoneGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateMilestone](np, sqlqueries.MTOTemplateMilestone.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateMilestoneGetByTemplateIDLoader returns template milestones by template ID
func MTOTemplateMilestoneGetByTemplateIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, templateIDs []uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	args := map[string]interface{}{
		"template_ids": pq.Array(templateIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateMilestone](np, sqlqueries.MTOTemplateMilestone.GetByTemplateIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateMilestoneGetByCategoryIDLoader returns template milestones by category ID
func MTOTemplateMilestoneGetByCategoryIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, categoryIDs []uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	args := map[string]interface{}{
		"category_ids": pq.Array(categoryIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateMilestone](np, sqlqueries.MTOTemplateMilestone.GetByCategoryIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateMilestoneGetBySolutionIDLoader returns template milestones by solution ID
func MTOTemplateMilestoneGetBySolutionIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, solutionIDs []uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	args := map[string]interface{}{
		"solution_ids": pq.Array(solutionIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateMilestone](np, sqlqueries.MTOTemplateMilestone.GetBySolutionIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}
