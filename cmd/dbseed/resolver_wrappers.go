package main

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func createModelPlan(store *storage.Store, logger *zap.Logger, modelName string, euaID string) *models.ModelPlan {
	userInfo := &models.UserInfo{
		CommonName: "Seeder",
		Email:      "seeder@local.fake",
		EuaUserID:  euaID,
	}
	princ := &authentication.EUAPrincipal{
		EUAID:             userInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
	plan, err := resolvers.ModelPlanCreate(logger, modelName, store, userInfo, princ)
	if err != nil {
		panic(err)
	}
	return plan
}

func updateModelPlan(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.ModelPlan {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
	updated, err := resolvers.ModelPlanUpdate(logger, mp.ID, changes, princ, store)
	if err != nil {
		panic(err)
	}
	return updated
}
