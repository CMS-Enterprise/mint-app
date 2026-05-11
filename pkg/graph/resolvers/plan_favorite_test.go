package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
)

// IsPlanFavorited checks if a model plan is a favorite.
func (suite *ResolverSuite) TestIsPlanFavorited() {

	plan := suite.createModelPlan("My Favorite Plan")

	_, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)

	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, suite.testConfigs.Principal)
	favorited, err := IsPlanFavorited(ctx, plan.ID)
	suite.NoError(err)
	suite.EqualValues(favorited, true)

}

func (suite *ResolverSuite) TestIsPlanFavoritedDataLoader() {
	plan1 := suite.createModelPlan("Favorite DataLoader Plan 1")
	plan2 := suite.createModelPlan("Favorite DataLoader Plan 2")

	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, suite.testConfigs.Principal)
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		return verifyIsPlanFavoritedLoader(ctx, plan1.ID, true)
	})
	g.Go(func() error {
		return verifyIsPlanFavoritedLoader(ctx, plan2.ID, true)
	})
	suite.NoError(g.Wait())
}

func verifyIsPlanFavoritedLoader(ctx context.Context, modelPlanID uuid.UUID, expected bool) error {
	isFavorite, err := IsPlanFavorited(ctx, modelPlanID)
	if err != nil {
		return err
	}
	if isFavorite != expected {
		return fmt.Errorf("IsFavorited for model plan %s: got %v, expected %v", modelPlanID, isFavorite, expected)
	}
	return nil
}

// PlanFavoriteCreate creates a new plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteCreate() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)
	suite.EqualValues(favorite.ModelPlanID, plan.ID)
	suite.EqualValues(favorite.UserID, plan.CreatedBy)
	suite.EqualValues(favorite.UserID, suite.testConfigs.Principal.Account().ID)

}

// PlanFavoriteDelete deletes a plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteDelete() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)

	del, err := PlanFavoriteDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(del.ID, favorite.ID)

}

// PlanFavoriteGet returns a plan favorite record
func (suite *ResolverSuite) TestPlanFavoriteGet() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)
	suite.NoError(err)

	retFav, err := PlanFavoriteGet(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(retFav.ID, favorite.ID)

}
