package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_discussion/create.sql
var planDiscussionCreateSQL string

//go:embed SQL/plan_discussion/update.sql
var planDiscussionUpdateSQL string

//go:embed SQL/plan_discussion/delete.sql
var planDiscussionDeleteSQL string

//go:embed SQL/plan_discussion/get_by_id.sql
var planDiscussionGetByID string

//go:embed SQL/discussion_reply/create.sql
var discussionReplyCreateSQL string

//go:embed SQL/discussion_reply/collection_by_discussion_id.sql
var discussionReplyCollectionByDiscussionIDSQL string

//go:embed SQL/discussion_reply/update.sql
var discussionReplyUpdateSQL string

//go:embed SQL/discussion_reply/delete.sql
var discussionReplyDeleteSQL string

//go:embed SQL/discussion_reply/get_by_id.sql
var discussionReplyGetByID string

//go:embed SQL/plan_discussion/get_by_model_plan_id_LOADER.sql
var planDiscussionGetByModelPlanIDLoaderSQL string

// PlanDiscussionGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanDiscussionGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.PlanDiscussion, error) {
	discSlice := []*models.PlanDiscussion{}

	stmt, err := s.db.PrepareNamed(planDiscussionGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&discSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return discSlice, nil
}

// PlanDiscussionCreate creates a plan discussion
func (s *Store) PlanDiscussionCreate(logger *zap.Logger, discussion *models.PlanDiscussion) (*models.PlanDiscussion, error) {
	discussion.ID = utilityUUID.ValueOrNewUUID(discussion.ID)

	statement, err := s.db.PrepareNamed(planDiscussionCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	discussion.ModifiedBy = nil
	discussion.ModifiedDts = nil

	err = statement.Get(discussion, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	return discussion, nil
}

// DiscussionReplyCreate creates a discussion reply
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

// DiscussionReplyCollectionByDiscusionID returns all Discussion repilies related to a plan discussion
func (s *Store) DiscussionReplyCollectionByDiscusionID(logger *zap.Logger, discussionID uuid.UUID) ([]*models.DiscussionReply, error) {
	replies := []*models.DiscussionReply{}

	stmt, err := s.db.PrepareNamed(discussionReplyCollectionByDiscussionIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"discussion_id": discussionID}

	err = stmt.Select(&replies, arg) //this returns more than one

	if err != nil {
		logger.Error(
			"Failed to fetch discusion replies",
			zap.Error(err),
			zap.String("discussion_id", discussionID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     replies,
			Operation: apperrors.QueryFetch,
		}
	}

	return replies, nil
}

// PlanDiscussionUpdate updates a plan discussion object
func (s *Store) PlanDiscussionUpdate(logger *zap.Logger, discussion *models.PlanDiscussion) (*models.PlanDiscussion, error) {
	statement, err := s.db.PrepareNamed(planDiscussionUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, discussion)
	}

	err = statement.Get(discussion, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, discussion)
	}

	return discussion, nil
}

// DiscussionReplyUpdate updates a discussion reply object
func (s *Store) DiscussionReplyUpdate(logger *zap.Logger, reply *models.DiscussionReply) (*models.DiscussionReply, error) {
	statement, err := s.db.PrepareNamed(discussionReplyUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, reply)
	}

	err = statement.Get(reply, reply)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, reply)
	}

	return reply, nil
}

// PlanDiscussionDelete deletes the plan discussion for a given id
func (s *Store) PlanDiscussionDelete(logger *zap.Logger, id uuid.UUID) (*models.PlanDiscussion, error) {
	statement, err := s.db.PrepareNamed(planDiscussionDeleteSQL)
	if err != nil {
		return nil, err
	}

	discussion := &models.PlanDiscussion{}
	err = statement.Get(discussion, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussion, nil
}

// PlanDiscussionByID retrieves the plan discussion for a given id
func (s *Store) PlanDiscussionByID(logger *zap.Logger, id uuid.UUID) (*models.PlanDiscussion, error) {
	statement, err := s.db.PrepareNamed(planDiscussionGetByID)
	if err != nil {
		return nil, err
	}

	discussion := &models.PlanDiscussion{}
	err = statement.Get(discussion, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussion, nil
}

// DiscussionReplyDelete deletes the discussion reply for a given id
func (s *Store) DiscussionReplyDelete(logger *zap.Logger, id uuid.UUID) (*models.DiscussionReply, error) {
	statement, err := s.db.PrepareNamed(discussionReplyDeleteSQL)
	if err != nil {
		return nil, err
	}
	//TODO should we use generic error handling?

	discussionReply := &models.DiscussionReply{}
	err = statement.Get(discussionReply, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussionReply, nil
}

// DiscussionReplyByID retrieves the discussion reply for a given id
func (s *Store) DiscussionReplyByID(logger *zap.Logger, id uuid.UUID) (*models.DiscussionReply, error) {
	statement, err := s.db.PrepareNamed(discussionReplyGetByID)
	if err != nil {
		return nil, err
	}

	discussionReply := &models.DiscussionReply{}
	err = statement.Get(discussionReply, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussionReply, nil
}
