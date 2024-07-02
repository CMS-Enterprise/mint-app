package storage

import (
	"database/sql"
	_ "embed"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/cmsgov/mint-app/pkg/sqlutils"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// PossibleOperationalSolutionContactsGetByPossibleSolutionIDLOADER returns
// Solution contacts that match the paramTable JSON
func (s *Store) PossibleOperationalSolutionContactsGetByPossibleSolutionIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PossibleOperationalSolutionContact, error) {

	// paramtableJSON should have possibleSolutionID as a key
	var contacts []*models.PossibleOperationalSolutionContact

	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolutionContact.CollectionGetByPossibleSolutionID)
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

// PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID returns the
// primary contact associated with a possible operational solution
func (s *Store) PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	possibleSolutionID int,
) (*models.PossibleOperationalSolutionContact, error) {

	contact := models.PossibleOperationalSolutionContact{}
	stmt, err := np.PrepareNamed(sqlqueries.PossibleOperationalSolutionContact.GetPrimaryContactByPossibleSolutionID)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	arg := map[string]interface{}{"possible_operational_solution_id": possibleSolutionID}

	err = stmt.Get(&contact, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Warn("No primary contact for possible operational solution",
				zap.Int("possibleSolutionID", possibleSolutionID))
			return nil, nil
		}

		logger.Error(
			"failed to fetch primary contact for possible operational solution",
			zap.Error(err),
			zap.Int("possibleSolutionID", possibleSolutionID),
		)

		return nil, fmt.Errorf("failed to fetch primary contact for possible operational solution: %w", err)
	}

	return &contact, nil
}
