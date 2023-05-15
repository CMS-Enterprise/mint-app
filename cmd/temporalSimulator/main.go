package main

// go build -a -o bin/tSim ./cmd/temporalSimulator
//  tSim addCol
import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "tSim",
	Short: "tSim is a tool for evaluating temporal tables",
	Long:  "tSim is a tool for evaluating temporal tables",
}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	removeColumnCommand.PersistentFlags().BoolP("remHistory", "c", false, "Removes the corresponding column from the history table ")
	removeColumnCommand.PersistentFlags().BoolP("alterHistory", "a", false, "Alters the history table column to allow nulls")
	rootCmd.AddCommand(removeColumnCommand)

	rootCmd.AddCommand(addColumnCommand)

	// alterEnumAddCommand.PersistentFlags().BoolP(("historyToString", "s", false, "Alters the history table column to allow nulls"))
	rootCmd.AddCommand(alterEnumAddCommand)

	alterEnumAddCommand.PersistentFlags().BoolP("historyToString", "s", false, "Alters the history table column to be a string type, so you keep historic values")
	alterEnumAddCommand.PersistentFlags().BoolP("historyToExpandedEnum", "e", false, "Alters the history table column to be an expanded enum type, so you keep historic values")
	alterEnumAddCommand.PersistentFlags().BoolP("remHistory", "r", false, "Alters the history table column to to remove instances of old values")
	rootCmd.AddCommand(alterEnumRemCommand)

	// removeColumnCommand.PersistentFlags().StringP("remHistory", "rh", "", "Formatting example: 07-07-2021-13:00")

}

func main() {
	execute()
}
