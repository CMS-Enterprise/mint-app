package main

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cmsgov/mint-app/pkg/worker"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the MINT application",
	Long:  `Serve the MINT application`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		// server.Serve(config)
		worker.Work()
	},
}
