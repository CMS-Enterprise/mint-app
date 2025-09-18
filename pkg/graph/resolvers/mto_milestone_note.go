package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func GetMTOMilestoneNoteByIDLOADER(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID) (*models.MTOMilestoneNote, error) {
	if principal == nil {
		return nil, fmt.Errorf("principal is nil")
	}
	notes, err := loaders.MTOMilestoneNote.ByMilestoneID.Load(ctx, id)
	if err != nil {
		return nil, err
	}
	if len(notes) == 0 {
		return nil, nil
	}
	return notes[0], nil
}

func GetMTOMilestoneNotesByMilestoneIDLOADER(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, milestoneID uuid.UUID) ([]*models.MTOMilestoneNote, error) {
	if principal == nil {
		return nil, fmt.Errorf("principal is nil")
	}
	notes, err := loaders.MTOMilestoneNote.ByMilestoneID.Load(ctx, milestoneID)
	if err != nil {
		return nil, err
	}
	if notes == nil {
		return []*models.MTOMilestoneNote{}, nil
	}
	return notes, nil
}

func CreateMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteCreateInput) (*models.MTOMilestoneNote, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Get the milestone to get its model plan ID
	milestone, err := loaders.MTOMilestone.ByID.Load(ctx, input.MTOMilestoneID)
	if err != nil {
		return nil, fmt.Errorf("failed to get milestone: %w", err)
	}

	note := models.NewMTOMilestoneNote(principalAccount.ID, input.Content, input.MTOMilestoneID, milestone.ModelPlanID)
	err = BaseStructPreCreate(logger, note, principal, store, false)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneNoteCreate(store, logger, note)
}

func UpdateMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteUpdateInput) (*models.MTOMilestoneNote, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOMilestoneNote, error) {
		existing, err := storage.MTOMilestoneNoteGetByIDLoader(tx, logger, input.ID)
		if err != nil {
			return nil, fmt.Errorf("unable to update MTO milestone note. Err %w", err)
		}
		existing.Content = input.Content
		err = BaseStructPreUpdate(logger, existing, nil, principal, store, false, true)
		if err != nil {
			logger.Error("error updating mto milestone note", zap.Error(err))
			return nil, err
		}
		return storage.MTOMilestoneNoteUpdate(tx, logger, existing)
	})
}

func DeleteMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteDeleteInput) (*models.MTOMilestoneNote, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOMilestoneNote, error) {
		existing, err := storage.MTOMilestoneNoteGetByIDLoader(tx, logger, input.ID)
		if err != nil {
			return nil, fmt.Errorf("unable to delete MTO milestone note. Err %w", err)
		}
		return storage.MTOMilestoneNoteDelete(tx, logger, existing)
	})
}
