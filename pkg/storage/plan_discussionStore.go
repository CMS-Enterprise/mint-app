package storage

import (
	"database/sql"
	_ "embed"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
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

//TODO: Migrate all these queries to the sql_queries package

// DiscussionReplyGetByDiscussionIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) DiscussionReplyGetByDiscussionIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.DiscussionReply, error) {

	var discRSlice []*models.DiscussionReply

	stmt, err := s.db.PrepareNamed(sqlqueries.DiscussionReply.GetByDiscussionIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&discRSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return discRSlice, nil
}

// PlanDiscussionGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func PlanDiscussionGetByModelPlanIDLOADER(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanIDs []uuid.UUID,
) ([]*models.PlanDiscussion, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	return sqlutils.SelectProcedure[models.PlanDiscussion](np, sqlqueries.PlanDiscussion.GetByModelPlanIDLoader, args)
}

// PlanDiscussionCreate creates a plan discussion
// the method is expected to be part of a larger transaction and does not handle  committing or rollingback the transactions
// if the *sqlx.Tx is nil, this function will create one. The returned tx is the same as the one in the parameters.
func (s *Store) PlanDiscussionCreate(
	logger *zap.Logger,
	discussion *models.PlanDiscussion,
	np sqlutils.NamedPreparer,
) (*models.PlanDiscussion, error) {

	discussion.ID = utilityuuid.ValueOrNewUUID(discussion.ID)

	stmt, err := np.PrepareNamed(planDiscussionCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}
	defer stmt.Close()

	discussion.ModifiedBy = nil
	discussion.ModifiedDts = nil
	retDiscussion := models.PlanDiscussion{}

	err = stmt.Get(&retDiscussion, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, discussion)
	}

	return &retDiscussion, nil
}

// DiscussionReplyCreate creates a discussion reply
// the method is expected to be part of a larger transaction and does not handle  committing or rolling back the transactions
// if the *sqlx.Tx is nil, this function will create one. The returned tx is the same as the one in the parameters.
func DiscussionReplyCreate(
	logger *zap.Logger,
	reply *models.DiscussionReply,
	np sqlutils.NamedPreparer,
) (*models.DiscussionReply, error) {

	reply.ID = utilityuuid.ValueOrNewUUID(reply.ID)

	stmt, err := np.PrepareNamed(sqlqueries.DiscussionReply.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, reply)
	}
	defer stmt.Close()
	retReply := models.DiscussionReply{}

	err = stmt.Get(&retReply, reply)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, reply)
	}

	return &retReply, nil
}

// PlanDiscussionUpdate updates a plan discussion object
func (s *Store) PlanDiscussionUpdate(
	logger *zap.Logger,
	discussion *models.PlanDiscussion,
) (*models.PlanDiscussion, error) {

	stmt, err := s.db.PrepareNamed(planDiscussionUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, discussion)
	}
	defer stmt.Close()

	err = stmt.Get(discussion, discussion)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, discussion)
	}

	return discussion, nil
}

// DiscussionReplyUpdate updates a discussion reply object
func (s *Store) DiscussionReplyUpdate(
	logger *zap.Logger,
	reply *models.DiscussionReply,
) (*models.DiscussionReply, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.DiscussionReply.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, reply)
	}
	defer stmt.Close()

	err = stmt.Get(reply, reply)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, reply)
	}

	return reply, nil
}

// PlanDiscussionDelete deletes the plan discussion for a given id
func (s *Store) PlanDiscussionDelete(
	_ *zap.Logger,
	id uuid.UUID,
	userID uuid.UUID,
) (*models.PlanDiscussion, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(planDiscussionDeleteSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	discussion := &models.PlanDiscussion{}
	err = stmt.Get(discussion, utilitysql.CreateIDQueryMap(id))
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
func (s *Store) PlanDiscussionByID(_ *zap.Logger, id uuid.UUID) (*models.PlanDiscussion, error) {

	stmt, err := s.db.PrepareNamed(planDiscussionGetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	discussion := &models.PlanDiscussion{}
	err = stmt.Get(discussion, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return discussion, nil
}

// PlanDiscussionByIDWithNumberOfReplies retrieves the plan discussion for a given id, and also returns the number of replies the discussion has
func PlanDiscussionByIDWithNumberOfReplies(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID, timeToCheck time.Time) (*models.PlanDiscussionWithNumberOfReplies, error) {
	args := map[string]interface{}{
		"id":            id,
		"time_to_check": timeToCheck,
	}

	discussionWithNumberOfReplies, procError := sqlutils.GetProcedure[models.PlanDiscussionWithNumberOfReplies](np, sqlqueries.PlanDiscussion.GetWithNumberOfRepliesAtTimeByID, args)
	if procError != nil {
		return nil, fmt.Errorf("issue returning PlanDiscussion With Number of Replies object: %w", procError)
	}
	return discussionWithNumberOfReplies, nil

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
	statement, err := tx.PrepareNamed(sqlqueries.DiscussionReply.Delete)
	if err != nil {
		return nil, err
	}
	defer statement.Close()

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
func (s *Store) DiscussionReplyByID(_ *zap.Logger, id uuid.UUID) (*models.DiscussionReply, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.DiscussionReply.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	discussionReply := &models.DiscussionReply{}
	err = stmt.Get(discussionReply, utilitysql.CreateIDQueryMap(id))
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

	stmt, err := s.db.PrepareNamed(getUserRoleSQL)
	if err != nil {
		logger.Error("failed to prepare SQL statement", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()

	var selection models.DiscussionRoleSelection

	err = stmt.Get(&selection, map[string]interface{}{"user_id": userID})
	if err == nil {
		return &selection, nil
	}

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	logger.Error("failed to get latest role selection", zap.Error(err))
	return nil, err
}
