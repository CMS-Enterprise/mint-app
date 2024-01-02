package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/cmsgov/mint-app/scripts/dev_command/command"
)

var rootCmd = &cobra.Command{
	Use:   "dev",
	Short: "dev is utility for running common development commadns",
	Long:  "dev is utility for running common development commadns",
	Run: func(cmd *cobra.Command, args []string) {
		RunPopulateUserTableTUIModel()
	},
}

func init() {
	rootCmd.AddCommand(command.StartDockerCommand)
	rootCmd.AddCommand(command.DBSeedCommand)

}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// TODO: https://github.com/CMSgov/mint-app/tree/00e01f91fd8e7e624c54c25d3b3f62d0a8a388d4/cmd/backfill is a good reference point
func main() {

	execute()
}
