package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

func MTOMilestoneNoteGetByMilestoneIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, milestoneIDs []uuid.UUID) ([]*models.MTOMilestoneNote, error) {
	returned, err := sqlutils.SelectProcedure[models.MTOMilestoneNote](np, sqlqueries.MTOMilestoneNote.GetByMilestoneIDLoader, map[string]interface{}{"milestone_ids": pq.Array(milestoneIDs)})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOMilestoneNoteGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOMilestoneNote, error) {
	returned, err := sqlutils.GetProcedure[models.MTOMilestoneNote](np, sqlqueries.MTOMilestoneNote.GetByIDLoader, map[string]interface{}{"id": pq.Array([]uuid.UUID{id})})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOMilestoneNoteCreate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOMilestoneNote *models.MTOMilestoneNote) (*models.MTOMilestoneNote, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOMilestoneNote](np, sqlqueries.MTOMilestoneNote.Create, MTOMilestoneNote)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOMilestoneNote object: %w", procErr)
	}
	return returned, nil
}

func MTOMilestoneNoteUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOMilestoneNote *models.MTOMilestoneNote) (*models.MTOMilestoneNote, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOMilestoneNote](np, sqlqueries.MTOMilestoneNote.Update, MTOMilestoneNote)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOMilestoneNote object: %w", procErr)
	}
	return returned, nil
}

func MTOMilestoneNoteDelete(np sqlutils.NamedPreparer, _ *zap.Logger, MTOMilestoneNote *models.MTOMilestoneNote) (*models.MTOMilestoneNote, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOMilestoneNote](np, sqlqueries.MTOMilestoneNote.Delete, MTOMilestoneNote)
	if procErr != nil {
		return nil, fmt.Errorf("issue deleting MTOMilestoneNote object: %w", procErr)
	}
	return returned, nil
}
