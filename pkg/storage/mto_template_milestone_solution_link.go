package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOTemplateMilestoneSolutionLinkGetByTemplateIDLoader returns milestone-solution links by template ID
func MTOTemplateMilestoneSolutionLinkGetByTemplateIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, templateIDs []uuid.UUID) ([]*models.MTOTemplateMilestoneSolutionLink, error) {
	args := map[string]interface{}{
		"template_ids": pq.Array(templateIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateMilestoneSolutionLink](np, sqlqueries.MTOTemplateMilestoneSolutionLink.GetByTemplateIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}
