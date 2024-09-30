package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

func (s *StoreTestSuite) TestWithTransaction() {

	s.Run("No errors will commit a transaction", func() {
		plan, err := sqlutils.WithTransaction[models.ModelPlan](s.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {
			modelName := "testing transactions"
			plan := models.NewModelPlan(s.principal.Account().ID, modelName)
			createdPlan, err := s.store.ModelPlanCreate(tx, s.logger, plan)
			if err != nil {
				return nil, err
			}
			return createdPlan, nil

		})
		s.NoError(err)
		s.NotNil(plan)

		planRet, err := s.store.ModelPlanGetByID(s.store, s.logger, plan.ID) // If the transaction was commited, we should get the plan
		s.NoError(err)
		s.NotNil(planRet)
	})

	s.Run("Errors will rollback a transaction", func() {
		plan, err := sqlutils.WithTransaction[models.ModelPlan](s.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {
			modelName := "testing transactions rollback"
			plan := models.NewModelPlan(s.principal.Account().ID, modelName)
			createdPlan, err := s.store.ModelPlanCreate(tx, s.logger, plan)
			if err != nil {
				return nil, err
			}
			return createdPlan, fmt.Errorf("this is an artificial error to ensure that the transaction rolls back")

		})
		s.Error(err)
		s.Nil(plan)
	})

	s.Run("With Transaction can also perform discrete db actions not directly part of the transaction", func() {
		modelName := "testing discrete actions don't rollback"
		var planGlobal *models.ModelPlan
		plan, err := sqlutils.WithTransaction[models.ModelPlan](s.store, func(tx *sqlx.Tx) (*models.ModelPlan, error) {

			plan := models.NewModelPlan(s.principal.Account().ID, modelName)
			createdPlan, err := s.store.ModelPlanCreate(s.store, s.logger, plan) //Call the method on the store itself, so it is automatically created
			if err != nil {
				return nil, err
			}
			planGlobal = createdPlan
			return createdPlan, fmt.Errorf("this is an artificial error to ensure that the transaction rolls back")

		})
		s.Error(err)
		s.Nil(plan) //if there is an error, WithTransaction returns nil

		planRet, err := s.store.ModelPlanGetByID(s.store, s.logger, planGlobal.ID) // The model plan was created directly, not as part of a transaction, so it isn't rolled back
		s.NoError(err)
		s.EqualValues(modelName, planRet.ModelName)
		s.NotNil(planRet)
	})

}
