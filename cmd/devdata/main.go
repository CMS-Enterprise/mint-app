package main

import (

	// _ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

func main() {
	config := testhelpers.NewConfig()
	logger, loggerErr := zap.NewDevelopment()
	if loggerErr != nil {
		panic(loggerErr)
	}

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, ldErr := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if ldErr != nil {
		panic(ldErr)
	}

	store, storeErr := storage.NewStore(logger, dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
	}

	userInfo := &models.UserInfo{
		CommonName: "mint Doe",
		Email:      "MINT@local.fake",
		EuaUserID:  "MINT",
	}

	createTestPlan(logger, store, userInfo, "Empty Test Plan")
	createTestPlanWithCollaborator(logger, store, userInfo, "Test Plan With Collaborators")
}

func createTestPlan(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo, name string) {
	_, err := resolvers.ModelPlanCreate(logger, name, store, userInfo)
	if err != nil {
		panic(err)
	}
}

func createTestPlanWithCollaborator(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo, name string) {
	plan, err := resolvers.ModelPlanCreate(logger, name, store, userInfo)
	if err != nil {
		panic(err)
	}
	pci := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		EuaUserID:   "BTAL",
		FullName:    "Betty Alpha",
		TeamRole:    models.TeamRoleLeadership,
	}
	_, err = resolvers.CreatePlanCollaborator(logger, pci, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}
}

// func createPlanWithBasicsFilled(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
// 	_, err := resolvers.ModelPlanCreate(logger, "Empty Test Plan", store, userInfo)
// 	if err != nil {
// 		panic(err)
// 	}
// }
