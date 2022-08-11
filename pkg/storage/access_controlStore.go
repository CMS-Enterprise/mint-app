package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/check_if_collaborator.sql
var checkIfCollaboratorSQL string

//CheckIfCollaborator returns true if the principal is a collaborator on a model plan.
func (s *Store) CheckIfCollaborator(logger *zap.Logger, principalID string, modelPlanID uuid.UUID) (bool, error) { //TODO provie

	isCollaborator := false

	stmt, err := s.db.PrepareNamed(checkIfCollaboratorSQL)
	if err != nil {
		return isCollaborator, err
	}
	arg := map[string]interface{}{
		"modelPlanID": modelPlanID,
		"euaID":       principalID,
	}

	err = stmt.Select(&isCollaborator, arg)
	if err != nil {
		return isCollaborator, err
	}
	return isCollaborator, nil

}
