package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

var rootCmd = &cobra.Command{
	Use:   "dbseed",
	Short: "Seed the DB",
	Long:  "Seeds the Database with Model Plans and associated data",
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		seedData(config)
	},
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func getResolverDependencies(config *viper.Viper) (*storage.Store, *zap.Logger) {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
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
	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if err != nil {
		panic(err)
	}

	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	return store, logger

}

func seedModelPlan(store *storage.Store, logger *zap.Logger, modelName string, euaID string) *models.ModelPlan {
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

func seedData(config *viper.Viper) {
	store, logger := getResolverDependencies(config)

	for i := 0; i < 5; i++ {
		seedModelPlan(store, logger, fmt.Sprint("Awesome Seed #", i), "MINT")
	}

}
