package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
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

// MTOCommonMilestoneArchive marks a common milestone as archived, removes its library/template references,
// and preserves already-applied model plan milestones.
func MTOCommonMilestoneArchive(
	np sqlutils.TransactionPreparer,
	logger *zap.Logger,
	id uuid.UUID,
	actorUserID uuid.UUID,
) (*models.MTOCommonMilestone, error) {
	return sqlutils.WithTransaction(np, func(tx *sqlx.Tx) (*models.MTOCommonMilestone, error) {
		return archiveMTOCommonMilestone(tx, logger, id, actorUserID)
	})
}

func archiveMTOCommonMilestone(
	tx *sqlx.Tx,
	_ *zap.Logger,
	id uuid.UUID,
	actorUserID uuid.UUID,
) (*models.MTOCommonMilestone, error) {
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return nil, err
	}

	args := map[string]any{
		"id":          id,
		"modified_by": actorUserID,
	}

	returned, err := sqlutils.GetProcedure[models.MTOCommonMilestone](tx, sqlqueries.MTOCommonMilestone.Archive, args)
	if err != nil {
		return nil, fmt.Errorf("issue archiving MTOCommonMilestone object: %w", err)
	}

	err = sqlutils.ExecProcedure(tx, sqlqueries.MTOCommonMilestone.DeleteTemplateMilestones, args)
	if err != nil {
		return nil, fmt.Errorf("issue deleting template milestones for archived MTOCommonMilestone: %w", err)
	}

	err = sqlutils.ExecProcedure(tx, sqlqueries.MTOCommonMilestone.DeleteSolutionLinks, args)
	if err != nil {
		return nil, fmt.Errorf("issue deleting common milestone solution links for archived MTOCommonMilestone: %w", err)
	}

	return returned, nil
}

type commonCategoryRow struct {
	Name          string         `db:"name"`
	SubCategories pq.StringArray `db:"sub_categories"`
}

// MTOCommonMilestoneGetCommonCategories returns deduplicated, alphabetized common categories.
// The source data currently comes from the mto_template_category table hierarchy.
func MTOCommonMilestoneGetCommonCategories(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.CommonCategory, error) {
	rows, err := sqlutils.SelectProcedure[commonCategoryRow](np, sqlqueries.MTOCommonMilestone.GetCommonCategories, map[string]any{})
	if err != nil {
		return nil, err
	}

	options := make([]*models.CommonCategory, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}

		options = append(options, &models.CommonCategory{
			Name:          row.Name,
			SubCategories: normalizeCommonCategorySubCategories(row.SubCategories),
		})
	}

	return options, nil
}

func normalizeCommonCategorySubCategories(subCategories pq.StringArray) []string {
	if len(subCategories) == 1 && subCategories[0] == "Uncategorized" {
		return []string{}
	}

	return []string(subCategories)
}
