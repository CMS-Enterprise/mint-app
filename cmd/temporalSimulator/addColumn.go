package main

import (
	_ "embed"
	"fmt"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed SQL/addColumnToModelPlan.sql
var addColumnToModelPlanSQL string

var addColumnCommand = &cobra.Command{
	Use:   "addCol",
	Short: "Add a Column to the MINT Model Plan table and history tables",
	Long:  `Add a Column to the MINT Model Plan table and history tables`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		fmt.Print("Hooray! you called the add column command")

	},
}

func addColumn(config *viper.Viper, s *storage.Store) (*string, error) {

	dbConfig := DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	db, err := NewDB(dbConfig)
	if err != nil {
		return nil, fmt.Errorf("error making db: %w", err)
	}

	statement, err := db.PrepareNamed(addColumnToModelPlanSQL)
	if err != nil {
		return nil, fmt.Errorf("error preparing statement: %w", err)
	}
	_, err = statement.Exec(nil)
	if err != nil {
		return nil, fmt.Errorf("Error adding column to db: %w", err)
	}

	return nil, nil

}

func NewDB(config DBConfig) (*sqlx.DB, error) {
	// LifecycleIDs are generated based on Eastern Time

	var db *sqlx.DB
	var err error
	if config.UseIAM {
		// Connect using the IAM DB package
		sess := session.Must(session.NewSession())
		db = newConnectionPoolWithIam(sess, config)
		err := db.Ping()
		if err != nil {
			return nil, err
		}
	} else {
		// Connect via normal user/pass
		dataSourceName := fmt.Sprintf(
			"host=%s port=%s user=%s "+
				"password=%s dbname=%s sslmode=%s",
			config.Host,
			config.Port,
			config.Username,
			config.Password,
			config.Database,
			config.SSLMode,
		)

		db, err = sqlx.Connect("postgres", dataSourceName)
		if err != nil {
			return nil, err
		}
	}

	db.SetMaxOpenConns(config.MaxConnections)

	return db, nil

}
