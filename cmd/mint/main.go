// Package main is the entrypoint for command line execution of the MINT tool
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "mint",
	Short: "MINT is an application for managing CMMI models",
	Long:  "MINT is an application for managing CMMI models",
}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(workerCmd)
	rootCmd.AddCommand(testCmd)
}

func main() {
	execute()
}
