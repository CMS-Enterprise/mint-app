package resolvers

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/models"
)

// PossibleOperationalSolutionContactsGetByPossibleSolutionID returns all the contacts associated with a possible operational solution
// it uses a data loader to ensure efficient querying
func PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx context.Context, possibleSolutionID int) ([]*models.PossibleOperationalSolutionContact, error) {
	fmt.Print(ctx, possibleSolutionID)
	return nil, nil
}
