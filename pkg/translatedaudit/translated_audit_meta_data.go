package translatedaudit

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// DiscussionReplyMetaDataGet uses the provided information to generate metadata needed for any discussion reply audits
func DiscussionReplyMetaDataGet(ctx context.Context, store *storage.Store, replyID interface{}, discussionID interface{}, auditTime time.Time) (*models.TranslatedAuditMetaDiscussionReply, error) {
	logger := appcontext.ZLogger(ctx)
	discussionUUID, err := parseInterfaceToUUID(discussionID)
	if err != nil {
		return nil, err
	}

	discussionWithReplies, err := storage.PlanDiscussionByIDWithNumberOfReplies(store, logger, discussionUUID, auditTime)
	if err != nil {
		return nil, fmt.Errorf("unable to get discussion by provided discussion ID for discussion reply translation metadata. err %w", err)
	}
	numOfReplies := discussionWithReplies.NumberOfReplies
	metaGeneric := models.NewTranslatedAuditMetaDiscussionReply("discussion_reply", 0, discussionWithReplies.ID, discussionWithReplies.Content.RawContent.String(), numOfReplies)
	return &metaGeneric, nil

}

func TranslatedAuditMetaData(ctx context.Context, store *storage.Store, audit *models.AuditChange) (models.TranslatedAuditMetaData, *models.TranslatedAuditMetaDataType, error) {
	// Changes: (ChChCh Changes!) Consider, do we need to handle if something is deleted differently? There might not be fetch-able information...
	switch audit.TableName {
	case "discussion_reply":
		metaData, err := DiscussionReplyMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.ModifiedDts)
		metaDataType := models.TAMetaDiscussionReply
		return metaData, &metaDataType, err
		// Changes: (Meta) Add meta data for Operational Needs
		// a. Need name
		// i. Maybe key? (probably not needed)
		// 	Name other too?

		// Changes: (Meta) Add meta data for Operational Solution
		// a. Solution name
		// i. Maybe key? (probably not needed)
		// 	Name other too?
		// number of subtasks?

	default:
		// Tables that aren't configured to generate meta data will return nil
		return nil, nil, nil
	}

}
