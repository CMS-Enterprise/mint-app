package main

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cms-enterprise/mint-app/pkg/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the MINT application",
	Long:  `Serve the MINT application`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()

		app := server.NewServer(config)

		go app.Worker.Work()
		app.Serve()
	},
}
