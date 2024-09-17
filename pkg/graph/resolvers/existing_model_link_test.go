package resolvers

import (
	"context"
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestExistingModelLinksUpdate() {
	modelToLink := suite.createModelPlan("The Linked model")
	plan := suite.createModelPlan("Plan For Model Link")
	existingModels, _ := ExistingModelCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)

	ids := lo.Map(existingModels, func(model *models.ExistingModel, _ int) int {
		return model.ID
	})

	/* LINK ALL EXISTING MODELS AND ASSERT LENGTH MATCHES */
	links, err := ExistingModelLinksUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan.ID, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, ids, nil)
	suite.NoError(err)
	suite.Len(links.Links, len(ids))

	/* Get links for another section, and confirm that there are no links */
	otherLinks, err := ExistingModelLinksGetByModelPlanIDAndFieldNameLOADER(suite.testConfigs.Context, plan.ID, models.EMLFTGeneralCharacteristicsParticipationExistingModelWhich)
	suite.NoError(err)
	suite.Len(otherLinks.Links, 0)

	/* Link the model plan, make sure other links were deleted, and that there is only the one link*/
	links2, err := ExistingModelLinksUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan.ID, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, nil, []uuid.UUID{modelToLink.ID})
	suite.NoError(err)
	suite.Len(links2.Links, 1)
	suite.Equal(links2.Links[0].ModelPlanID, plan.ID)
	suite.Equal(links2.Links[0].CurrentModelPlanID, &modelToLink.ID)

}

func (suite *ResolverSuite) ExistingModelLinkGetByID() {
	plan1 := suite.createModelPlan("Plan For Link 1")
	existingModels, _ := ExistingModelCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)

	links, err := ExistingModelLinksUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan1.ID, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, []int{existingModels[0].ID}, nil)
	suite.NoError(err)
	suite.Len(links, 1)
	link1 := links.Links[0]
	suite.NotNil(link1)

	retLink, err := ExistingModelLinkGetByID(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, link1.ID)
	suite.NoError(err)
	suite.Equal(retLink.ExistingModelID, existingModels[0].ID)
	suite.Nil(retLink.CurrentModelPlanID)
	suite.Nil(retLink.ModifiedBy)
	suite.Nil(retLink.ModifiedDts)

	suite.EqualValues(suite.testConfigs.Principal.Account().ID, retLink.CreatedBy)

}

func (suite *ResolverSuite) TestExistingModelLinkDataLoader() {
	plan1 := suite.createModelPlan("Plan For Link 1")
	plan2 := suite.createModelPlan("Plan For Link 2")

	plan3 := suite.createModelPlan("Alphabetical Plan For Link 3")

	genCharWhichField := models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich
	_, err := ExistingModelLinksUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan1.ID, genCharWhichField, nil, []uuid.UUID{plan2.ID, plan1.ID})
	suite.NoError(err)

	_, err2 := ExistingModelLinksUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan2.ID, genCharWhichField, nil, []uuid.UUID{plan2.ID, plan1.ID, plan3.ID})
	suite.NoError(err2)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyExistingModelLinkLoader(ctx, plan1.ID, genCharWhichField)
	})
	g.Go(func() error {
		return verifyExistingModelLinkLoader(ctx, plan2.ID, genCharWhichField)
	})
	err3 := g.Wait()
	suite.NoError(err3)

	suite.Run("Name data loader returns correctly", func() {

		var wg sync.WaitGroup
		wg.Add(3) //note there are three tests
		go func() {
			defer wg.Done()
			suite.verifyExistingModelLinkNameLoader(plan1.ID, genCharWhichField, 2, plan1.ModelName)
		}()
		go func() {
			defer wg.Done()
			suite.verifyExistingModelLinkNameLoader(plan2.ID, genCharWhichField, 3, plan3.ModelName)
		}()
		go func() {
			defer wg.Done()
			suite.verifyExistingModelLinkNameLoader(plan3.ID, genCharWhichField, 0, "")
		}()
		wg.Wait()
	})

}
func verifyExistingModelLinkLoader(ctx context.Context, modelPlanID uuid.UUID, fieldName models.ExisitingModelLinkFieldType) error {

	links, err := ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER(ctx, modelPlanID, fieldName)
	if err != nil {
		return err
	}
	if len(links) < 1 {
		return fmt.Errorf("no existing Model Link returned model plan ID %s", modelPlanID)
	}

	if modelPlanID != links[0].ModelPlanID {
		return fmt.Errorf("existing Model Link returned model plan ID %s, expected %s", links[0].ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) verifyExistingModelLinkNameLoader(
	modelPlanID uuid.UUID,
	fieldName models.ExisitingModelLinkFieldType,
	expectedCount int,
	firstName string) {

	names, err := ExistingModelLinksNameArray(suite.testConfigs.Context, modelPlanID, fieldName)
	suite.NoError(err)
	suite.Len(names, expectedCount)
	if len(names) > 1 {
		suite.EqualValues(firstName, names[0])
	}

}
