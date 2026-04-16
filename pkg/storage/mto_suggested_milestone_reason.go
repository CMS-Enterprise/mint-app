package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneIDLoader returns all suggestion reasons
// for a slice of mto_suggested_milestone IDs.
func MTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneIDLoader(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	ids []uuid.UUID,
) ([]*models.MTOSuggestedMilestoneReason, error) {
	args := map[string]any{
		"ids": pq.Array(ids),
	}
	return sqlutils.SelectProcedure[models.MTOSuggestedMilestoneReason](
		np,
		sqlqueries.MTOSuggestedMilestoneReason.GetByMTOSuggestedMilestoneIDLoader,
		args,
	)
}
