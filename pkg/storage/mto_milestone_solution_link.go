package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOMilestoneSolutionLinkCreate creates a new MTO Milestone-Solution link in the database
func MTOMilestoneSolutionLinkCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	mtoMilestoneSolutionLink *models.MTOMilestoneSolutionLink,
) (*models.MTOMilestoneSolutionLink, error) {

	if mtoMilestoneSolutionLink.ID == uuid.Nil {
		mtoMilestoneSolutionLink.ID = uuid.New()
	}

	link, procErr := sqlutils.GetProcedure[models.MTOMilestoneSolutionLink](
		np,
		sqlqueries.MTOMilestoneSolutionLink.Create,
		mtoMilestoneSolutionLink,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTO Milestone-Solution link: %w", procErr)
	}

	return link, nil
}

// MTOMilestoneSolutionLinkGetByMilestoneID returns all MTO Milestone-Solution links for a given Milestone ID
func MTOMilestoneSolutionLinkGetByMilestoneID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	milestoneID uuid.UUID,
) ([]*models.MTOMilestoneSolutionLink, error) {

	arg := map[string]interface{}{"milestone_id": milestoneID}

	returned, procErr := sqlutils.SelectProcedure[models.MTOMilestoneSolutionLink](
		np,
		sqlqueries.MTOMilestoneSolutionLink.GetByMilestoneID,
		arg,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving MTO Milestone-Solution links: %w", procErr)
	}

	return returned, nil
}
