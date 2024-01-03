package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// go run scripts/dev_command/*.go frontent
var FrontEndStartCommand = &cobra.Command{
	Use:   "frontend",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		fmt.Printf("Ran the Start Front End Locally Command with command : %s", cmd.Use)
		bringUPFrontend()

	},
}

func bringUPFrontend() {
	/*
		Check if port is free, if not return warning, else start it

	*/
	// command := `yarn && yarn start`
	// command := []string{"yarn", "&&", "yarn start"}
	command := []string{"yarn start"}

	cmd := exec.Command(command[0], command[1:]...)
	// Show the command line output in the terminal
	// TODO, see about not capturing all docker logs
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// docker compose -f docker-compose.backend.yml up --build
	// TODO, we shouldn't stop docker when we stop this command. Look at the dev script for verification
	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}

	err = cmd.Wait()
	if err != nil {
		log.Fatal(err)
	}
}
