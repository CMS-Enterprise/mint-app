package main

import (
	_ "embed"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed SQL/alterEnumAdd.sql
var alterEnumAddSQL string

var alterEnumAddCommand = &cobra.Command{
	Use:   "alterEnumAdd",
	Short: "Adds a value to MODEL_PLAN_STATUS enum which is used in MINT Model Plan table",
	Long:  `Adds a value to MODEL_PLAN_STATUS enum which is used in MINT Model Plan table`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		db, err := NewDefaultDB(config)
		if err != nil {
			fmt.Print("error making DB %w", err)
			return
		}

		response, err := alterEnumAdd(config, db)
		if err != nil {
			fmt.Print("error adding column: %w", err)
		}

		fmt.Printf("Hooray! you called the alter enum command. Message: %s", response)

	},
}

func alterEnumAdd(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumAddSQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
