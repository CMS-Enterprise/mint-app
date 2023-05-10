package main

// go build -a -o bin/tSim ./cmd/temporalSimulator
//  tSim addCol
import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/storage"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

var rootCmd = &cobra.Command{
	Use:   "tSim",
	Short: "tSim is a tool for evaluating temporal tables",
	Long:  "tSim is a tool for evaluating temporal tables",
}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(addColumnCommand)
	rootCmd.AddCommand(removeColumnCommand)
	rootCmd.AddCommand(alterEnumCommand)
}

func main() {
	execute()
}

func GetStore() (*storage.Store, error) {
	config := viper.New()
	config.AutomaticEnv()

	// Create the logger
	logger := zap.NewNop()

	// Create LD Client, which is required for creating the store
	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if err != nil {
		panic(err)
	}

	// Create the DB Config & Store
	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	return store, err
}
