package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

func CTATDiscussionCreate(np sqlutils.NamedPreparer, discussion *models.CTATDiscussion) (*models.CTATDiscussion, error) {
	return sqlutils.GetProcedure[models.CTATDiscussion](np, sqlqueries.CTATDiscussion.Create, discussion)
}

func CTATDiscussionByTicketID(np sqlutils.NamedPreparer, ticketIDs []uuid.UUID) ([]*models.CTATDiscussion, error) {
	args := map[string]any{
		"ticket_ids": pq.Array(ticketIDs),
	}

	return sqlutils.SelectProcedure[models.CTATDiscussion](np, sqlqueries.CTATDiscussion.GetByTicketIDLoader, args)
}
