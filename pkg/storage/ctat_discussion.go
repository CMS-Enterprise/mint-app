package storage

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

func CTATDiscussionCreate(np sqlutils.NamedPreparer, discussion *models.CTATDiscussion) (*models.CTATDiscussion, error) {
	var createdDts *time.Time
	if !discussion.CreatedDts.IsZero() {
		createdDts = &discussion.CreatedDts
	}

	args := map[string]any{
		"ticket_id":   discussion.TicketID,
		"content":     discussion.Content,
		"poster_role": discussion.PosterRole,
		"created_by":  discussion.CreatedBy,
		"created_dts": createdDts,
	}
	return sqlutils.GetProcedure[models.CTATDiscussion](np, sqlqueries.CTATDiscussion.Create, args)
}

func CTATDiscussionByTicketID(np sqlutils.NamedPreparer, ticketIDs []uuid.UUID) ([]*models.CTATDiscussion, error) {
	args := map[string]any{
		"ticket_ids": pq.Array(ticketIDs),
	}

	return sqlutils.SelectProcedure[models.CTATDiscussion](np, sqlqueries.CTATDiscussion.GetByTicketIDLoader, args)
}
