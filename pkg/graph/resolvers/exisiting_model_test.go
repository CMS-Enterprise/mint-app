package resolvers

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"
)

// ExistingModelCollectionGet returns all existing models
func (suite *ResolverSuite) TestExistingModelCollectionGet() {
	existingModels, err := ExistingModelCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(existingModels)

}

func (suite *ResolverSuite) TestExistingModelDataLoader() {

	existingModels, err := ExistingModelCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyExistingModelLoader(ctx, existingModels[0].ID)
	})
	g.Go(func() error {
		return verifyExistingModelLoader(ctx, existingModels[3].ID)
	})
	err = g.Wait()
	suite.NoError(err)

}
func verifyExistingModelLoader(ctx context.Context, id int) error {

	eM, err := ExistingModelGetByIDLOADER(ctx, id)
	if err != nil {
		return err
	}

	if id != eM.ID {
		return fmt.Errorf("existing Model returned ID %v, expected %v", eM.ID, id)
	}
	return nil
}
