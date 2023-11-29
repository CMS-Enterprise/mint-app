package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *StoreTestSuite) TestWithTransaction() {

	suite.Run("No errors will commit a transaction", func() {
		plan, err := WithTransaction[models.ModelPlan](suite.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {
			modelName := "testing transactions"
			plan := models.NewModelPlan(suite.principal.Account().ID, modelName)
			createdPlan, err := suite.store.ModelPlanCreate(tx, suite.logger, plan)
			if err != nil {
				return nil, err
			}
			return createdPlan, nil

		})
		suite.NoError(err)
		suite.NotNil(plan)

		planRet, err := suite.store.ModelPlanGetByID(suite.store, suite.logger, plan.ID) // If the transaction was commited, we should get the plan
		suite.NoError(err)
		suite.NotNil(planRet)
	})

	suite.Run("Errors will rollback a transaction", func() {
		plan, err := WithTransaction[models.ModelPlan](suite.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {
			modelName := "testing transactions rollback"
			plan := models.NewModelPlan(suite.principal.Account().ID, modelName)
			createdPlan, err := suite.store.ModelPlanCreate(tx, suite.logger, plan)
			if err != nil {
				return nil, err
			}
			return createdPlan, fmt.Errorf("this is an artificial error to ensure that the transaction rolls back")

		})
		suite.Error(err)
		suite.Nil(plan)
	})

	suite.Run("With Transaction can also perform discrete db actions not directly part of the transaction", func() {
		modelName := "testing discrete actions don't rollback"
		var planGlobal *models.ModelPlan
		plan, err := WithTransaction[models.ModelPlan](suite.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {

			plan := models.NewModelPlan(suite.principal.Account().ID, modelName)
			createdPlan, err := suite.store.ModelPlanCreate(suite.store, suite.logger, plan) //Call the method on the store itself, so it is automatically created
			if err != nil {
				return nil, err
			}
			planGlobal = createdPlan
			return createdPlan, fmt.Errorf("this is an artificial error to ensure that the transaction rolls back")

		})
		suite.Error(err)
		suite.Nil(plan) //if there is an error, WithTransaction returns nil

		planRet, err := suite.store.ModelPlanGetByID(suite.store, suite.logger, planGlobal.ID) // The model plan was created directly, not as part of a transaction, so it isn't rolled back
		suite.NoError(err)
		suite.EqualValues(modelName, planRet.ModelName)
		suite.NotNil(planRet)
	})

}
