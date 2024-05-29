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
	metaReply := models.NewTranslatedAuditMetaDiscussionReply("discussion_reply", 0, discussionWithReplies.ID, discussionWithReplies.Content.RawContent.String(), numOfReplies)
	return &metaReply, nil

}

// OperationalNeedMetaDataGet uses the provided information to generate metadata needed for any operational need audits
func OperationalNeedMetaDataGet(ctx context.Context, store *storage.Store, opNeedID interface{}) (*models.TranslatedAuditMetaOperationalNeed, error) {
	logger := appcontext.ZLogger(ctx)
	opNeedUUID, err := parseInterfaceToUUID(opNeedID)
	if err != nil {
		return nil, err
	}
	opNeed, err := store.OperationalNeedGetByID(logger, opNeedUUID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational need audit metadata. err %w", err)
	}

	metaNeed := models.NewTranslatedAuditMetaOperationalNeed("operational_need", 0, opNeed.GetName(), opNeed.GetIsOther())

	return &metaNeed, nil

}

// OperationalSolutionMetaDataGet uses the provided information to generate metadata needed for any operational solution audits
func OperationalSolutionMetaDataGet(ctx context.Context, store *storage.Store, opSolutionID interface{}) (*models.TranslatedAuditMetaOperationalSolution, error) {
	logger := appcontext.ZLogger(ctx)
	opSolutionUUID, err := parseInterfaceToUUID(opSolutionID)
	if err != nil {
		return nil, err
	}
	opSolutionWithSubtasks, err := storage.OperationalSolutionGetByIDWithNumberOfSubtasks(store, logger, opSolutionUUID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational solution with num of Subtasks for operational solution audit metadata. err %w", err)
	}

	opNeed, err := store.OperationalNeedGetByID(logger, opSolutionWithSubtasks.OperationalNeedID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational need audit metadata. err %w", err)
	}

	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational solution audit metadata. err %w", err)
	}

	metaNeed := models.NewTranslatedAuditMetaOperationalSolution(
		"operational_solution",
		0,
		opSolutionWithSubtasks.GetName(),
		opSolutionWithSubtasks.GetIsOther(),
		opSolutionWithSubtasks.NumberOfSubtasks,
		opNeed.GetName(),
		opNeed.GetIsOther(),
	)

	return &metaNeed, nil

}

func TranslatedAuditMetaData(ctx context.Context, store *storage.Store, audit *models.AuditChange) (models.TranslatedAuditMetaData, *models.TranslatedAuditMetaDataType, error) {
	// Changes: (ChChCh Changes!) Consider, do we need to handle if something is deleted differently? There might not be fetch-able information...
	switch audit.TableName {
	// Changes: (Meta) add unit tests for these.
	case "discussion_reply":
		metaData, err := DiscussionReplyMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.ModifiedDts)
		metaDataType := models.TAMetaDiscussionReply
		return metaData, &metaDataType, err
	case "operational_need":
		metaData, err := OperationalNeedMetaDataGet(ctx, store, audit.PrimaryKey)
		metaDataType := models.TAMetaOperationalNeed
		return metaData, &metaDataType, err
	case "operational_solution":
		metaData, err := OperationalSolutionMetaDataGet(ctx, store, audit.PrimaryKey)
		metaDataType := models.TAMetaOperationalSolution
		return metaData, &metaDataType, err

		// Changes: (Meta) Add meta data for Operational Solution
		// a. Solution name
		// i. Maybe key? (probably not needed)
		// 	Name other too?
		// number of subtasks?

		// Changes: (Meta) Add meta data for Operational Solution Subtask
		// 1. Operational Solution info (from ID)
		// 2. Need information?
		// 3. other?
		// Changes: (Meta)
		// Document Link
		// 1. all the document information each time ( because )
		// Solution link

	default:
		// Tables that aren't configured to generate meta data will return nil
		return nil, nil, nil
	}

}
