package storage

import (
	"database/sql"
	_ "embed"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

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

//go:embed SQL/plan_discussion/get_most_recent_user_role.sql
var getUserRoleSQL string

//go:embed SQL/discussion_reply/create.sql
var discussionReplyCreateSQL string

//go:embed SQL/discussion_reply/update.sql
var discussionReplyUpdateSQL string

//go:embed SQL/discussion_reply/delete.sql
var discussionReplyDeleteSQL string

//go:embed SQL/discussion_reply/get_by_id.sql
var discussionReplyGetByID string

//go:embed SQL/plan_discussion/get_by_model_plan_id_LOADER.sql
var planDiscussionGetByModelPlanIDLoaderSQL string

//go:embed SQL/discussion_reply/get_by_discussion_id_LOADER.sql
var discussionReplyGetByDiscussionIDLoaderSQL string

// DiscussionReplyGetByDiscussionIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) DiscussionReplyGetByDiscussionIDLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.DiscussionReply, error) {

	var discRSlice []*models.DiscussionReply
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&discRSlice, discussionReplyGetByDiscussionIDLoaderSQL, arg)
	if err != nil {
		return nil, err
	}

	return discRSlice, nil
}

// PlanDiscussionGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanDiscussionGetByModelPlanIDLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanDiscussion, error) {

	var discSlice []*models.PlanDiscussion
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&discSlice, planDiscussionGetByModelPlanIDLoaderSQL, arg)
	if err != nil {
		return nil, err
	}

	return discSlice, nil
}

// PlanDiscussionCreate creates a plan discussion
func (s *Store) PlanDiscussionCreate(
	logger *zap.Logger,
	discussion *models.PlanDiscussion,
) (*models.PlanDiscussion, error) {

	discussion.ID = utilityUUID.ValueOrNewUUID(discussion.ID)
	discussion.ModifiedBy = nil
	discussion.ModifiedDts = nil

	err := s.db.Get(discussion, planDiscussionCreateSQL, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	return discussion, nil
}

// DiscussionReplyCreate creates a discussion reply
func (s *Store) DiscussionReplyCreate(
	logger *zap.Logger,
	reply *models.DiscussionReply,
) (*models.DiscussionReply, error) {

	reply.ID = utilityUUID.ValueOrNewUUID(reply.ID)

	err := s.db.Get(reply, discussionReplyCreateSQL, reply)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, reply)
	}

	return reply, nil
}

// PlanDiscussionUpdate updates a plan discussion object
func (s *Store) PlanDiscussionUpdate(
	logger *zap.Logger,
	discussion *models.PlanDiscussion,
) (*models.PlanDiscussion, error) {

	err := s.db.Get(discussion, planDiscussionUpdateSQL, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, discussion)
	}

	return discussion, nil
}

// DiscussionReplyUpdate updates a discussion reply object
func (s *Store) DiscussionReplyUpdate(logger *zap.Logger, reply *models.DiscussionReply) (*models.DiscussionReply, error) {

	err := s.db.Get(reply, discussionReplyUpdateSQL, reply)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, reply)
	}

	return reply, nil
}

// PlanDiscussionDelete deletes the plan discussion for a given id
func (s *Store) PlanDiscussionDelete(logger *zap.Logger, id uuid.UUID, userID uuid.UUID) (*models.PlanDiscussion, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}
	statement, err := tx.PrepareNamed(planDiscussionDeleteSQL)
	if err != nil {
		return nil, err
	}

	discussion := &models.PlanDiscussion{}
	err = statement.Get(discussion, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit discussion delete transaction: %w", err)
	}

	return discussion, nil
}

// PlanDiscussionByID retrieves the plan discussion for a given id
func (s *Store) PlanDiscussionByID(logger *zap.Logger, id uuid.UUID) (*models.PlanDiscussion, error) {

	discussion := &models.PlanDiscussion{}
	err := s.db.Get(discussion, planDiscussionGetByID, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussion, nil
}

// DiscussionReplyDelete deletes the discussion reply for a given id
func (s *Store) DiscussionReplyDelete(logger *zap.Logger, id uuid.UUID, userID uuid.UUID) (*models.DiscussionReply, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()
	args := map[string]interface{}{
		"id": id,
	}

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}
	statement, err := tx.PrepareNamed(discussionReplyDeleteSQL)
	if err != nil {
		return nil, err
	}

	discussionReply := &models.DiscussionReply{}
	err = statement.Get(discussionReply, args)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit discussion reply delete transaction: %w", err)
	}

	return discussionReply, nil
}

// DiscussionReplyByID retrieves the discussion reply for a given id
func (s *Store) DiscussionReplyByID(logger *zap.Logger, id uuid.UUID) (*models.DiscussionReply, error) {

	discussionReply := &models.DiscussionReply{}
	err := s.db.Get(discussionReply, discussionReplyGetByID, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussionReply, nil
}

// GetMostRecentDiscussionRoleSelection retrieves the latest role selection for a given user
func (s *Store) GetMostRecentDiscussionRoleSelection(
	logger *zap.Logger,
	userID uuid.UUID,
) (*models.DiscussionRoleSelection, error) {

	var selection models.DiscussionRoleSelection
	err := s.db.Get(&selection, getUserRoleSQL, map[string]interface{}{"user_id": userID})

	if err == nil {
		return &selection, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	logger.Error("failed to get latest role selection", zap.Error(err))
	return nil, err
}
