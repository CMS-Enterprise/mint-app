package translatedaudit

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func DiscussionReplyMetaDataGet(ctx context.Context, store *storage.Store, replyID interface{}, discussionID interface{}) (*models.TranslatedAuditMetaGeneric, error) {
	logger := appcontext.ZLogger(ctx)
	discussionUUID, err := parseInterfaceToUUID(discussionID)
	if err != nil {
		return nil, err
	}

	discussion, err := store.PlanDiscussionByID(logger, discussionUUID)
	if err != nil {
		return nil, fmt.Errorf("unable to get discussion by provided discussion ID for discussion reply translation metadata. err %w", err)
	}
	metaGeneric := models.NewTranslatedAuditMetaGeneric("discussion_reply", 0, "discussion_name", discussion.Content.RawContent.String())
	return &metaGeneric, nil

}

func TranslatedAuditMetaData(ctx context.Context, store *storage.Store, audit *models.AuditChange) (models.TranslatedAuditMetaData, error) {
	switch audit.TableName {
	case "discussion_reply":
		return DiscussionReplyMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey)

	default:
		return nil, nil
	}

}
