package command

import (
	"fmt"

	"github.com/spf13/cobra"
)

var DBSeedCommand = &cobra.Command{
	Use:   "db:seed",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Seeding the database command with command : %s", cmd.Use)

	},
}
