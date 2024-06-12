package resolvers

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"
)

func (suite *ResolverSuite) TestPossibleOperationalSolutionContactsGetByPossibleSolutionID() {

	contacts, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(suite.testConfigs.Context, 1)
	suite.NoError(err)
	suite.NotNil(contacts)
	suite.Len(contacts, 5) //currently there are five solutions for solution 1 ( 4innovation (4i) )
}

func (suite *ResolverSuite) TestPossibleOperationalSolutionContactsDataLoader() {
	possibleSolutions, err := PossibleOperationalSolutionCollectionGetAll(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotEmpty(possibleSolutions)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	for _, posSol := range possibleSolutions {
		solID := posSol.ID
		theFunc := func() error {
			return verifySolutionContactLoader(ctx, solID)
		}
		g.Go(theFunc)

	}
	err = g.Wait()
	suite.NoError(err)
}

func verifySolutionContactLoader(ctx context.Context, solutionID int) error {
	contacts, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx, solutionID)
	if err != nil {
		return err
	}
	if len(contacts) < 1 {
		return nil // Not all possible operational solutions have contacts.
	}
	if solutionID != contacts[0].PossibleOperationalSolutionID {
		return fmt.Errorf("op solution contact returned operational solution ID %d, expected %d", contacts[0].PossibleOperationalSolutionID, solutionID)
	}
	return nil

}

// Test retrieving the primary contact for a possible operational solution
func (suite *ResolverSuite) TestPossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID() error {
	contact, err := suite.testConfigs.Store.PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		1,
	)

	suite.NoError(err)
	suite.NotNil(contact)
	suite.Equal(1, contact.PossibleOperationalSolutionID)
	suite.Equal("4i/ACO-OS Team", contact.Name)

	return nil
}
