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

//go:embed SQL/access_control/check_if_collaborator_by_operational_need_id.sql
var checkIfCollaboratorByOperationalNeedIDSQL string

// CheckIfCollaborator returns true if the principal is a collaborator on a model plan.
func (s *Store) CheckIfCollaborator(_ *zap.Logger, principalID uuid.UUID, modelPlanID uuid.UUID) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorSQL)
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

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorDiscussionIDSQL)
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

// CheckIfCollaboratorBySolutionID returns true if the principal is a collaborator on a model plan associated
// with a Solution by SolutionID.
func (s *Store) CheckIfCollaboratorBySolutionID(
	_ *zap.Logger,
	principalID uuid.UUID,
	solutionID uuid.UUID,
) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorBySolutionIDSQL)
	if err != nil {
		return isCollaborator, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"solution_id": solutionID,
		"user_id":     principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil
}

// CheckIfCollaboratorByOperationalNeedID returns true if the principal is a collaborator on a model plan associated
// with a OperationalNeed by OperationalNeedID.
func (s *Store) CheckIfCollaboratorByOperationalNeedID(
	_ *zap.Logger,
	principalID uuid.UUID,
	operationalNeedID uuid.UUID,
) (bool, error) {

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorByOperationalNeedIDSQL)
	if err != nil {
		return isCollaborator, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"need_id": operationalNeedID,
		"user_id": principalID,
	}

	err = stmt.Get(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil
}
