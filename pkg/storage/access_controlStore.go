package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/check_if_collaborator.sql
var checkIfCollaboratorSQL string

//go:embed SQL/check_if_collaborator_discussion_id.sql
var checkIfCollaboratorDiscussionIDSQL string

//CheckIfCollaborator returns true if the principal is a collaborator on a model plan.
func (s *Store) CheckIfCollaborator(logger *zap.Logger, principalID string, modelPlanID uuid.UUID) (bool, error) { //TODO provie

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorSQL)
	if err != nil {
		return isCollaborator, err
	}
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"eua_user_id":   principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil

}

//CheckIfCollaboratorByDiscussionID returns true if the principal is a collaborator on a model plan, by the relation on the plan discussion
func (s *Store) CheckIfCollaboratorByDiscussionID(logger *zap.Logger, principalID string, discussionID uuid.UUID) (bool, error) { //TODO provie

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorDiscussionIDSQL)
	if err != nil {
		return isCollaborator, err
	}
	arg := map[string]interface{}{
		"discussion_id": discussionID,
		"eua_user_id":   principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil

}
