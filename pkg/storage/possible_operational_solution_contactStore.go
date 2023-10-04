package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/possible_operational_solution_contact/collection_get_by_possible_solution_id.sql
var possibleOperationalSolutionContactsGetByPossibleSolutionIDLOADERSQL string

// PossibleOperationalSolutionContactsGetByPossibleSolutionIDLOADER returns
// Solution contacts that match the paramTable JSON
func (s *Store) PossibleOperationalSolutionContactsGetByPossibleSolutionIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PossibleOperationalSolutionContact, error) {

	// paramtableJSON should have possibleSolutionID as a key
	var contacts []*models.PossibleOperationalSolutionContact

	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionContactsGetByPossibleSolutionIDLOADERSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&contacts, arg) //this returns more than one
	if err != nil {
		return nil, err
	}

	return contacts, nil

}
