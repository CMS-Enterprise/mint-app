package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var upIncludeFrontendFlag = flagComponent{
	Name:      "frontend",
	ShortHand: "f",
	Usage:     "Include the frontend when bringing docker up",
}

var upDebugFlag = flagComponent{
	Name:      "debug",
	ShortHand: "d",
	Usage:     "Debug the application on the backend using delve",
}

var upDebugWaitFlag = flagComponent{
	Name:      "wait",
	ShortHand: "w",
	Usage:     "Wait for to attach to the debugger on the backend using delve. Setting this automatically sets the debug flag to true",
}

var upCIFlag = flagComponent{
	Name:      "ci",
	ShortHand: "c",
	Usage:     "CI is used when the command is being run in CI. It will append other command",
}

// go run scripts/dev_command/*.go up
var StartDockerCommand = &cobra.Command{
	Use:   "up",
	Short: "Starts the docker environment",
	Long:  "Starts the docker environment",
	Run: func(cmd *cobra.Command, args []string) {
		config := viper.New()
		config.AutomaticEnv()
		fmt.Printf("Ran the Start Docker Command with command : %s ", cmd.Use)
		frontend, err := cmd.Flags().GetBool(upIncludeFrontendFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}

		debug, err := cmd.Flags().GetBool(upDebugFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}
		debugWait, err := cmd.Flags().GetBool(upDebugWaitFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}
		ci, err := cmd.Flags().GetBool(upCIFlag.Name)
		if err != nil {
			panic(fmt.Errorf("unable to run command, %w", err))
		}
		if debugWait { // automatically set the debug variable if wait is set
			debug = true
		}

		// fmt.Printf("Include frontend %v . Debug %v. DebugWait %v. CI %v ", frontend, debug, debugWait, ci)

		detachCommand := []string{"-d"} // Note -d is used to ensure that we don't also see the logs, and that docker continues to run when this is done.
		bringDockerUp(frontend, detachCommand, debug, debugWait, ci)
	},
}

// StopDockerCommand is the command to stop the MINT docker services
var StopDockerCommand = &cobra.Command{
	Use:   "down",
	Short: "Stops all services",
	Long:  "Stops all services in the project",
	Run: func(cmd *cobra.Command, args []string) {
		bringDockerDown()
	},
}

func init() {
	// frontend command
	StartDockerCommand.Flags().BoolP(upIncludeFrontendFlag.Name, upIncludeFrontendFlag.ShortHand, false, upIncludeFrontendFlag.Usage)
	StartDockerCommand.Flags().Lookup(upIncludeFrontendFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

	// debug command
	StartDockerCommand.Flags().BoolP(upDebugFlag.Name, upDebugFlag.ShortHand, false, upDebugFlag.Usage)
	StartDockerCommand.Flags().Lookup(upDebugFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

	// debug wait command
	StartDockerCommand.Flags().BoolP(upDebugWaitFlag.Name, upDebugWaitFlag.ShortHand, false, upDebugWaitFlag.Usage)
	StartDockerCommand.Flags().Lookup(upDebugWaitFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

	// CI command
	StartDockerCommand.Flags().BoolP(upCIFlag.Name, upCIFlag.ShortHand, false, upCIFlag.Usage)
	StartDockerCommand.Flags().Lookup(upCIFlag.Name).NoOptDefVal = "true" // Sets the default value to true when the flag is present

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

// bringDockerUp is the method to bring up all services in the application
func bringDockerUp(frontendIncluded bool, args []string, debug, wait, ci bool) {
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

	command := "docker-compose"
	comArgs := []string{"-f", "docker-compose.backend.yml"}
	if frontendIncluded {
		comArgs = append(comArgs, "-f", "docker-compose.frontend.yml")
	}
	comArgs = append(comArgs, "up")
	if !ci {
		comArgs = append(comArgs, "--build")
	}

	if len(args) > 0 {
		comArgs = append(comArgs, args...)
	}

	// #nosec G204 // We have sanitized the command, so we can ignore this warning
	cmd := exec.Command(command, comArgs[0:]...)
	cmd.Env = os.Environ()
	for key, value := range environment {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", key, value))
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// docker compose -f docker-compose.backend.yml up --build -d
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

// bringDockerDown stops all docker containers
func bringDockerDown() {
	mainCommand := "docker-compose"
	command := []string{"-f", "docker-compose.backend.yml", "-f", "docker-compose.frontend.yml", "down"}
	// #nosec G204 // We have sanitized the command, so we can ignore this warning
	cmd := exec.Command(mainCommand, command[0:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}

	err = cmd.Wait()
	if err != nil {
		log.Fatal(err)
	}

}
