package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/access_control/check_if_collaborator.sql
var checkIfCollaboratorSQL string

//go:embed SQL/access_control/check_if_collaborator_discussion_id.sql
var checkIfCollaboratorDiscussionIDSQL string

//go:embed SQL/access_control/check_if_collaborator_by_solution_id.sql
var checkIfCollaboratorBySolutionIDSQL string

// CheckIfCollaborator returns true if the principal is a collaborator on a model plan.
func (s *Store) CheckIfCollaborator(logger *zap.Logger, principalID string, modelPlanID uuid.UUID) (bool, error) {

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

// CheckIfCollaboratorByDiscussionID returns true if the principal is a collaborator on a model plan, by the relation on the plan discussion
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

// CheckIfCollaboratorBySolutionID returns true if the principal is a collaborator on a model plan associated
// with a Solution by SolutionID.
func (s *Store) CheckIfCollaboratorBySolutionID(
	logger *zap.Logger,
	principalID string,
	solutionID uuid.UUID,
) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorBySolutionIDSQL)
	if err != nil {
		return isCollaborator, err
	}
	arg := map[string]interface{}{
		"solution_id": solutionID,
		"eua_user_id": principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil

}
