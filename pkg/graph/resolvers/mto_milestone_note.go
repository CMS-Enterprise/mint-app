package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func CreateMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID, content string) (*models.MTOMilestoneNote, error) {
	note := models.NewMTOMilestoneNote(id, content, principal.Account().ID)
	err := BaseStructPreCreate(logger, note, principal, store, false)
	if err != nil {
		return nil, err
	}

	note, err = storage.MTOMilestoneNoteCreate(store, logger, note)
	if err != nil {
		return nil, err
	}
	return note, nil
}
