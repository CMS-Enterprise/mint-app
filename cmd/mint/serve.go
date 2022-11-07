package main

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/server"
	"github.com/cmsgov/mint-app/pkg/worker"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the MINT application",
	Long:  `Serve the MINT application`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		env, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
		if err != nil {
			panic(err)
		}
		if env.Local() {
			go worker.Work()
		}
		server.Serve(config)
	},
}
