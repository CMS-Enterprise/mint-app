package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_discussion_create.sql
var planDiscussionCreateSQL string

//go:embed SQL/discussion_reply_create.sql
var discussionReplyCreateSQL string

// PlanDiscussionCreate creates a plan discussion
func (s *Store) PlanDiscussionCreate(logger *zap.Logger, discussion *models.PlanDiscussion) (*models.PlanDiscussion, error) {
	discussion.ID = utilityUUID.ValueOrNewUUID(discussion.ID)

	statement, err := s.db.PrepareNamed(planDiscussionCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	err = statement.Get(discussion, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	return discussion, nil
}

//DiscussionReplyCreate creates a discussion reply
func (s *Store) DiscussionReplyCreate(logger *zap.Logger, reply *models.DiscussionReply) (*models.DiscussionReply, error) {
	reply.ID = utilityUUID.ValueOrNewUUID(reply.ID)

	statement, err := s.db.PrepareNamed(discussionReplyCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, reply)
	}

	err = statement.Get(reply, reply)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, reply)
	}

	return reply, nil
}
