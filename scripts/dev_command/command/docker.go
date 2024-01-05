package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var includeFrontendFlag = flagComponent{
	Name:      "frontend",
	ShortHand: "f",
	Usage:     "Include the frontend when bringing docker up",
}

var debugFlag = flagComponent{
	Name:      "debug",
	ShortHand: "d",
	Usage:     "Debug the application on the backend using delve",
}

var debugWaitFlag = flagComponent{
	Name:      "wait",
	ShortHand: "w",
	Usage:     "Wait for to attach to the debugger on the backend using delve. Setting this automatically sets the debug flag to true",
}

type flagComponent struct {
	Name      string
	ShortHand string
	Usage     string
}

// go run scripts/dev_command/*.go up
var StartDockerCommand = &cobra.Command{
	Use:   "up",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		fmt.Printf("Ran the Start Docker Command with command : %s ", cmd.Use)
		frontend, err := cmd.Flags().GetBool(includeFrontendFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}

		debug, err := cmd.Flags().GetBool(debugFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}
		debugWait, err := cmd.Flags().GetBool(debugWaitFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}

		fmt.Printf("Include frontend %v . Debug %v. Debugwait %v ", frontend, debug, debugWait)
		_ = up

		// up(false, []string{"-d"}, true, false, false)
		// Note -d is used to ensure that we don't also see the logs, and that docker continues to run when this is done.

	},

	//TODO: add flags for all variations of the command
}

// getStartDockerCommandFlags

func init() {
	// frontend command
	StartDockerCommand.Flags().BoolP(includeFrontendFlag.Name, includeFrontendFlag.ShortHand, false, includeFrontendFlag.Usage)
	StartDockerCommand.Flags().Lookup(includeFrontendFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

	//debug command
	StartDockerCommand.Flags().BoolP(debugFlag.Name, debugFlag.ShortHand, false, debugFlag.Usage)
	StartDockerCommand.Flags().Lookup(debugFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

	//debug wait command
	StartDockerCommand.Flags().BoolP(debugWaitFlag.Name, debugWaitFlag.ShortHand, false, debugWaitFlag.Usage)
	StartDockerCommand.Flags().Lookup(debugWaitFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

}

var PruneDockerCommand = &cobra.Command{
	Use:   "docker:prune",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		fmt.Printf("Ran the Prune Docker Command with command : %s", cmd.Use)
		dockerPrune()

	},
}

func up(frontendIncluded bool, args []string, debug, wait, ci bool) {
	conf := " "
	if debug {
		conf = os.Getenv("AIR_CONFIG_DEBUG")
		if wait {
			conf = os.Getenv("AIR_CONFIG_DEBUG_WAIT")
		}
	}

	environment := map[string]string{
		"COMPOSE_HTTP_TIMEOUT": "120",
		"AIR_CONFIG":           conf,
	}

	contribsysDockerLogin()

	command := []string{"docker", "compose", "-f", "docker-compose.backend.yml"}
	if frontendIncluded {
		command = append(command, "-f", "docker-compose.frontend.yml")
	}
	command = append(command, "up")
	if !ci {
		command = append(command, "--build")
	}

	if len(args) > 0 {
		command = append(command, args...)
	}

	//TODO: use cobra to set environment variables? I don't know that you need to set the os.ENVIRON (or maybe you do)
	cmd := exec.Command(command[0], command[1:]...)
	cmd.Env = os.Environ()
	for key, value := range environment {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", key, value))
	}

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

	// This runs the command and waits for an end to parse the string
	// output, err := cmd.CombinedOutput()
	// if err != nil {
	// 	log.Fatalf("command failed: %s\n%s", strings.Join(command, " "), output)
	// }

	if !wait {
		waitForSuccess("Waiting for the back end to build...", "curl", "--silent", "--output", "/dev/null", "-m", "1", "localhost:8085/api/v1/healthcheck")
	} else {
		check := "echo '{\"method\":\"RPCServer.State\",\"params\":[],\"id\":1}' | nc -w 1 localhost 2350 | grep 'result' -q"
		waitForSuccess("Waiting for backend debug server...", "/bin/sh", "-c", check)
		fmt.Println("✨ Make sure to connect the debugger, or the backend service won't start ✨ ")
	}

	if frontendIncluded {
		waitForSuccess("Waiting for the front end to build...", "curl", "--silent", "--output", "/dev/null", "-m", "1", "localhost:3005")
	}
}

func dockerPrune() {

}
