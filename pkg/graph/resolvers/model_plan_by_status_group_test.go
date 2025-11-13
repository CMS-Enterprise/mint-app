package resolvers

import (
	"context"
	"fmt"
	"slices"

	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestModelPlanByStatusGroupDataLoader() {
	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyModelPlanByStatusGroupLoader(ctx, models.ModelPlanStatusGroupActive)
	})
	g.Go(func() error {
		return verifyModelPlanByStatusGroupLoader(ctx, models.ModelPlanStatusGroupPreClearance)
	})
	err := g.Wait()
	suite.NoError(err)

}

func verifyModelPlanByStatusGroupLoader(ctx context.Context, statusGroup models.ModelPlanStatusGroup) error {

	plans, err := ModelPlansByStatusGroupLOADER(ctx, statusGroup)
	if err != nil {
		return err
	}
	// Ensure every returned plan has a status that belongs to the expected status group.
	for _, p := range plans {
		if !slices.Contains(models.ModelPlanStatusGroupToModelStatus[statusGroup], p.Status) {
			return fmt.Errorf("model Plan returned model plan status %v, which is not in status group %s", p.Status, statusGroup)
		}
	}
	return nil
}
