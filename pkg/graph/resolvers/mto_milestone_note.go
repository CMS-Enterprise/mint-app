package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/jmoiron/sqlx"
)

func CreateMTOMilestoneNoteResolver(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteCreateInput) (*models.MTOMilestoneNote, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	note := models.NewMTOMilestoneNote(principalAccount.ID, "", input.MTOMilestoneID)
	err := BaseStructPreCreate(logger, note, principal, store, false)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneNoteCreate(store, logger, note)
}

func UpdateMTOMilestoneNoteResolver(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteUpdateInput) (*models.MTOMilestoneNote, error) {
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

func DeleteMTOMilestoneNoteResolver(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteDeleteInput) (*models.MTOMilestoneNote, error) {
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
