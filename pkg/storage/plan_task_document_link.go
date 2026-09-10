package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// PlanTaskDocumentLinkCreate creates a new plan task document link in the database.
func PlanTaskDocumentLinkCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	planTaskDocumentLink *models.PlanTaskDocumentLink,
) (*models.PlanTaskDocumentLink, error) {

	if planTaskDocumentLink.ID == uuid.Nil {
		planTaskDocumentLink.ID = uuid.New()
	}

	link, procErr := sqlutils.GetProcedure[models.PlanTaskDocumentLink](
		np,
		sqlqueries.PlanTaskDocumentLink.Create,
		planTaskDocumentLink,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new plan task document link: %w", procErr)
	}

	return link, nil
}
