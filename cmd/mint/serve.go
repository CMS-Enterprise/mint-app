package main

import (
	"strconv"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve the MINT application",
	Long:  `Serve the MINT application`,
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()

		app := server.NewServer(config)

		processJobs, err := strconv.ParseBool(string(app.Config.GetString(appconfig.FaktoryProcessJobs)))

		if err != nil {
			panic(err)
		} else if processJobs {
			go app.Worker.Work()
		}

		app.Serve()
	},
}
