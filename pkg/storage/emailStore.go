package storage

import (
	_ "embed"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
)

//go:embed SQL/email/solution_selected_details_get.sql
var solutionSelectedDetailsGet string

// GetSolutionSelectedDetails queries the database to return information that is useful
func (s *Store) GetSolutionSelectedDetails(solutionID uuid.UUID) (*email.SolutionSelectedDB, error) {
	stmt, err := s.db.PrepareNamed(solutionSelectedDetailsGet)
	if err != nil {

		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"sol_id": solutionID,
	}
	solDetails := email.SolutionSelectedDB{}

	err = stmt.Get(&solDetails, arg)
	if err != nil {

		return nil, err

	}
	return &solDetails, nil
}
