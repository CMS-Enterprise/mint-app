package main

import (
	_ "embed"
	"fmt"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cmsgov/mint-app/pkg/appconfig"
)

//go:embed SQL/addColumnToModelPlan.sql
var addColumnToModelPlanSQL string

//go:embed SQL/addColumnToModelPlanHistory.sql
var addColumnToModelPlanHistorySQL string

var addColumnCommand = &cobra.Command{
	Use:   "addCol",
	Short: "Add a Column to the MINT Model Plan table and history tables",
	Long:  `Add a Column to the MINT Model Plan table and history tables`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		db, err := NewDefaultDB(config)
		if err != nil {
			fmt.Print("error making DB %w", err)
			return
		}

		response, err := addColumn(config, db)
		if err != nil {
			fmt.Print("error adding column: %w", err)
		}

		fmt.Print("Hooray! you called the add column command. Message: %w", response)

	},
}

func addColumn(config *viper.Viper, db *sqlx.DB) (*string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, addColumnToModelPlanSQL, nilArg)
	if err != nil {
		return msg, err
	}

	msg, err = executeProcedure(config, db, addColumnToModelPlanHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	// statement, err := db.PrepareNamed(addColumnToModelPlanSQL)
	// if err != nil {
	// 	return nil, fmt.Errorf("error preparing statement: %w", err)
	// }
	// _, err = statement.Exec(map[string]interface{}{})
	// if err != nil {
	// 	return nil, fmt.Errorf("error adding column to db: %w", err)
	// }

	return msg, nil

}

func executeProcedure(config *viper.Viper, db *sqlx.DB, query string, args map[string]interface{}) (*string, error) {

	statement, err := db.PrepareNamed(query)
	if err != nil {
		return nil, fmt.Errorf("error preparing statement: %w", err)
	}
	_, err = statement.Exec(map[string]interface{}{})
	if err != nil {
		return nil, fmt.Errorf("error executing statement: %w", err)
	}

	msg := "success"
	return &msg, nil

}

func NewDefaultDB(config *viper.Viper) (*sqlx.DB, error) {
	dbConfig := DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	return NewDB(dbConfig)

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
