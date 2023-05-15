package main

import (
	_ "embed"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed SQL/alterEnumRem.sql
var alterEnumRemSQL string

//go:embed SQL/alterEnumRemHistory.sql
var alterEnumRemHistorySQL string

//go:embed SQL/alterEnumRemStringHistory.sql
var alterEnumRemStringHistorySQL string

//go:embed SQL/alterEnumRemExpandedHistory.sql
var alterEnumRemExpandedHistorySQL string

var alterEnumRemCommand = &cobra.Command{
	Use:   "alterEnumRem",
	Short: "Removes a value to MODEL_PLAN_STATUS enum which is used in MINT Model Plan table",
	Long:  `Removes a value to MODEL_PLAN_STATUS enum which is used in MINT Model Plan table`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		db, err := NewDefaultDB(config)
		if err != nil {
			fmt.Print("error making DB %w", err)
			return
		}
		var response string

		remHistoryFlag, err := cmd.Flags().GetBool("remHistory")
		if err != nil {
			fmt.Print("error parsing flag: %w", err)
		}
		historyToStringFlag, err := cmd.Flags().GetBool("historyToString")
		if err != nil {
			fmt.Print("error parsing flag: %w", err)
		}

		historyToExpandedEnumFlag, err := cmd.Flags().GetBool("historyToExpandedEnum")
		if err != nil {
			fmt.Print("error parsing flag: %w", err)
		}
		if historyToStringFlag {
			response1, err1 := alterEnumRemStringHistory(config, db)
			if err != nil {
				fmt.Print("error converting column in history to string type: %w", err1)
			}
			response = response + response1

		}
		if historyToExpandedEnumFlag {
			response1, err2 := alterEnumRemExpandedHistory(config, db)
			if err != nil {
				fmt.Print("error changing column in history to expanded type: %w", err2)
			}
			response = response + response1

		}

		if remHistoryFlag {
			response3, err3 := alterEnumRemHistory(config, db)
			if err != nil {
				fmt.Print("error removing values from column in history: %w", err3)
			}
			response = response + response3

		}

		response4, err := alterEnumRem(config, db)
		if err != nil {
			fmt.Print("error removing enum val : %w", err)
		}
		response = response + response4

		fmt.Printf("Hooray! you called the alter enum  remove command. Message: %s", response)

	},
}

func alterEnumRem(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumRemSQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}

func alterEnumRemHistory(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumRemHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
func alterEnumRemExpandedHistory(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumRemExpandedHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}

func alterEnumRemStringHistory(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumRemStringHistorySQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
