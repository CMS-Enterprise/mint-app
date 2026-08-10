package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestModelPlanLinkCreate creates a CTAT request model-plan link row.
func CTATRequestModelPlanLinkCreate(
	np sqlutils.NamedPreparer,
	link *models.CTATRequestModelPlanLink,
) (*models.CTATRequestModelPlanLink, error) {
	if link.ID == uuid.Nil {
		link.ID = uuid.New()
	}

	link.ModifiedBy = nil
	link.ModifiedDts = nil

	createdLink, procErr := sqlutils.GetProcedure[models.CTATRequestModelPlanLink](np, sqlqueries.CTATRequestModelPlanLink.Create, link)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating CTAT request model-plan link: %w", procErr)
	}

	return createdLink, nil
}
