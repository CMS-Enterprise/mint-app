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

//go:embed SQL/removeColumnFromModelPlanHistory.sql
var removeColumnfromModelPlanHistorySQL string

//go:embed SQL/alterColumnFromModelPlanHistory.sql
var alterColumnfromModelPlanHistorySQL string

var removeColumnCommand = &cobra.Command{
	Use:   "remCol",
	Short: "Remove archived Column from the MINT Model Plan table",
	Long:  `Remove aarchived Column from the MINT Model Plan table`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		db, err := NewDefaultDB(config)
		if err != nil {
			fmt.Print("error making DB %w", err)
			return
		}
		remHistoryFlag, err := cmd.Flags().GetBool("remHistory")
		if err != nil {
			fmt.Print("error parsing flag: %w", err)
		}
		alterHistoryFlag, err := cmd.Flags().GetBool("alterHistory")
		if err != nil {
			fmt.Print("error parsing flag: %w", err)
		}

		response, err := remColumn(config, db)
		if err != nil {
			fmt.Print("error removing column: %w", err)
		}
		if alterHistoryFlag {
			response2, err := alterHistoryColumn(config, db)
			if err != nil {
				fmt.Print("error removing column from history: %w", err)
			}
			response = response + response2
		}

		if remHistoryFlag {
			response3, err := remHistoryColumn(config, db)
			if err != nil {
				fmt.Print("error removing column from history: %w", err)
			}
			response = response + response3
		}

		fmt.Print("Hooray! you called the remove column command. Message: %w", response)
		//NOTE, that you can't update a model plan now, because the history table still has the column, which isn't nullable.

	},
}

func remColumn(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, removeColumnfromModelPlanSQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}

func remHistoryColumn(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, removeColumnfromModelPlanHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}

func alterHistoryColumn(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterColumnfromModelPlanHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
