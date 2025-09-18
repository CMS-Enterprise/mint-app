package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func CreateMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteCreateInput) (*models.MTOMilestoneNote, error) {
	return CreateMTOMilestoneNoteResolver(ctx, logger, principal, store, input)
}

func UpdateMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteUpdateInput) (*models.MTOMilestoneNote, error) {
	return UpdateMTOMilestoneNoteResolver(ctx, logger, principal, store, input)
}

func DeleteMTOMilestoneNote(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, input models.MTOMilestoneNoteDeleteInput) (*models.MTOMilestoneNote, error) {
	return DeleteMTOMilestoneNoteResolver(ctx, logger, principal, store, input)
}
