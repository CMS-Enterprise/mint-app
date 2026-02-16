package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// CheckIfCollaborator returns true if the principal is a collaborator on a model plan.
func (s *Store) CheckIfCollaborator(_ *zap.Logger, principalID uuid.UUID, modelPlanID uuid.UUID) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(sqlqueries.AccessControl.CheckIfCollaborator)
	if err != nil {
		return isCollaborator, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"user_id":       principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil
}

// CheckIfCollaboratorByDiscussionID returns true if the principal is a
// collaborator on a model plan, by the relation on the plan discussion
func (s *Store) CheckIfCollaboratorByDiscussionID(
	_ *zap.Logger,
	principalID uuid.UUID,
	discussionID uuid.UUID,
) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(sqlqueries.AccessControl.CheckIfCollaboratorByDiscussionID)
	if err != nil {
		return isCollaborator, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"discussion_id": discussionID,
		"user_id":       principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil
}

func (s *Store) CheckIfCollaboratorByMilestoneID(
	_ *zap.Logger,
	principalID uuid.UUID,
	milestoneID uuid.UUID,
) (bool, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.AccessControl.CheckIfCollaboratorByMilestoneID)
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	args := map[string]any{
		"milestone_id": milestoneID,
		"user_id":      principalID,
	}

	var isCollaborator bool
	if err := stmt.Get(&isCollaborator, args); err != nil {
		return false, err
	}

	return isCollaborator, nil
}
