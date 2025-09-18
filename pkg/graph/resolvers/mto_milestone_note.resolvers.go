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
	return CreateMTOMilestoneNote(ctx, logger, principal, store, id, content)
}
