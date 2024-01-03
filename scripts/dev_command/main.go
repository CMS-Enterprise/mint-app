package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/cmsgov/mint-app/scripts/dev_command/command"
)

var rootCmd = &cobra.Command{
	Use:   "dev",
	Short: "dev is utility for running common development commands",
	Long:  "dev is utility for running common development commands",
	Run: func(cmd *cobra.Command, args []string) {
		RunPopulateUserTableTUIModel()
	},
}

func init() {
	rootCmd.AddCommand(command.StartDockerCommand)
	rootCmd.AddCommand(command.DBSeedCommand)
	rootCmd.AddCommand(command.FrontEndStartCommand)
	rootCmd.AddCommand(command.PruneDockerCommand)

}

// TODO:
/*
 Maybe a user preference file for sequence of tasks

*/
/* Core Set of Functions
1. Bring down environment, rebuild the backend, and bring up the backend (for reviewing PRS, schema changes etc)

Eventually, replace all dev scripts
*/

//TODO:
/*
What other utilities could we use?
1. Get LD hash?
	--> might be a useful command line

2. Other commands that are rarely used, but beneficial?


FRONTEND
3. Update snapshots
4. Populate Test suites that you want to run, and run those
	--> FrontEnd --> Ashley has looked into VITest for test suites
*/
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
