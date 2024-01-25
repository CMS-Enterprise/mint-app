package command

import (
	"fmt"

	"github.com/spf13/cobra"
)

// DBCommand holds all relevant commands to do
var DBCommand = &cobra.Command{
	Use:   "db",
	Short: "All commands needed to interact with the database",
	Long:  "All commands needed to interact with the database",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Ran the database command with command : %s", cmd.Use) //TODO add a default sub command

	},
}

var dbSeedCommand = &cobra.Command{
	Use:   "seed",
	Short: "Seeds the database using placeholder data",
	Long:  "Seeds the database using placeholder data",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Seeding the database command with command : %s", cmd.Use)

	},
}

func init() {
	DBCommand.AddCommand(dbSeedCommand)

}
