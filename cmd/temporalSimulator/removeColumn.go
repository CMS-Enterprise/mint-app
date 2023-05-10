package main

import (
	_ "embed"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed SQL/removeColumnFromModelPlan.sql
var removeColumnfromModelPlanSQL string

var removeColumnCommand = &cobra.Command{
	Use:   "remCol",
	Short: "Remove a Column from the MINT Model Plan table",
	Long:  `Remove a Column from the MINT Model Plan table`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		db, err := NewDefaultDB(config)
		if err != nil {
			fmt.Print("error making DB %w", err)
			return
		}

		response, err := remColumn(config, db)
		if err != nil {
			fmt.Print("error adding column: %w", err)
		}

		fmt.Print("Hooray! you called the add column command. Message: %w", response)

	},
}

func remColumn(config *viper.Viper, db *sqlx.DB) (*string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, removeColumnfromModelPlanSQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
