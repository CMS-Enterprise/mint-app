package command

import (
	"fmt"

	"github.com/spf13/cobra"
)

// DBCommand holds all relevant commands to do
var DBCommand = &cobra.Command{
	Use:   "db",
	Short: "DB Operations",
	Long:  "DB Operations: All commands needed to interact with the database",
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
var dbMigrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Runs database migrations and waits for them to complete",
	Run: func(cmd *cobra.Command, args []string) {
		// Your migration logic here
	},
}

var dbRecreateCmd = &cobra.Command{
	Use:   "recreate",
	Short: "Destroys the database container and recreates it",
	Run: func(cmd *cobra.Command, args []string) {
		// Your recreate logic here
	},
}

var dbDropConnectionsCmd = &cobra.Command{
	Use:   "drop_connections",
	Short: "Drops idle connections from the database",
	Run: func(cmd *cobra.Command, args []string) {
		// Your drop connections logic here
	},
}

var dbCleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Deletes all rows from specified tables and performs cleanup",
	Run: func(cmd *cobra.Command, args []string) {
		// Your clean logic here
	},
}

func init() {
	DBCommand.AddCommand(dbSeedCommand)
	DBCommand.AddCommand(dbMigrateCmd)
	DBCommand.AddCommand(dbRecreateCmd)
	DBCommand.AddCommand(dbDropConnectionsCmd)
	DBCommand.AddCommand(dbCleanCmd)

}
