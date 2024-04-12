package storage

import (
	"database/sql"
	_ "embed"
	"errors"
	"fmt"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/possible_operational_solution_contact/collection_get_by_possible_solution_id.sql
var possibleOperationalSolutionContactsGetByPossibleSolutionIDLOADERSQL string

//go:embed SQL/possible_operational_solution_contact/primary_contact_get_by_possible_solution_id.sql
var possibleOperationalSolutionPrimaryContactGetByPossibleSolutionIDSQL string

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

// PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID returns
// the primary contact for a possible operational solution
func (s *Store) PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID(
	logger *zap.Logger,
	possibleOperationalSolutionID int,
) (*models.PossibleOperationalSolutionContact, error) {

	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionPrimaryContactGetByPossibleSolutionIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	contact := models.PossibleOperationalSolutionContact{}
	arg := map[string]interface{}{
		"possible_operational_solution_id": possibleOperationalSolutionID,
	}

	err = stmt.Get(&contact, arg)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error(
			"failed to fetch possible operational solution primary contact",
			zap.Error(err),
			zap.Int("possibleOperationalSolutionID", possibleOperationalSolutionID),
		)

		return nil, &apperrors.QueryError{
			Err:       fmt.Errorf("failed to fetch possible operational solution primary contact: %w", err),
			Operation: apperrors.QueryFetch,
		}
	}

	return &contact, nil
}
