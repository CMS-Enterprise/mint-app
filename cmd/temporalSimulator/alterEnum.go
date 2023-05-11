package main

import (
	_ "embed"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

//go:embed SQL/alterEnum.sql
var alterEnumSQL string

var alterEnumCommand = &cobra.Command{
	Use:   "alterEnum",
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

		response, err := alterEnum(config, db)
		if err != nil {
			fmt.Print("error adding column: %w", err)
		}

		fmt.Printf("Hooray! you called the alter enum command. Message: %s", response)

	},
}

func alterEnum(config *viper.Viper, db *sqlx.DB) (string, error) {

	nilArg := map[string]interface{}{}
	msg, err := executeProcedure(config, db, alterEnumSQL, nilArg)
	if err != nil {
		return msg, err
	}

	return msg, nil

}
