package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

// go run scripts/dev_command/*.go up
var StartDockerCommand = &cobra.Command{
	Use:   "up",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Ran the Start Docker Command with command : %s", cmd.Use)
		up(false, []string{}, true, false, false)

		// QueryUserNamesAndExportToJSON()

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
