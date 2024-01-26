package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"time"

	"github.com/spf13/cobra"
)

// DBCommand holds all relevant commands to do
var DBCommand = &cobra.Command{
	Use:   "db",
	Short: "DB Operations",
	Long:  "DB Operations: All commands needed to interact with the database",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Ran the database command with command : %s", cmd.Use) //TODO add a default sub command

	},
}

var dbSeedCommand = &cobra.Command{
	Use:   "seed",
	Short: "Seeds the database using placeholder data",
	Long:  "Seeds the database using placeholder data",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Seeding the database command with command : %s", cmd.Use)

	},
}

// DBMigrateCmd migrates the database
var DBMigrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Runs database migrations and waits for them to complete",
	Run: func(cmd *cobra.Command, args []string) {
		dbMigrate()
	},
}

var dbRecreateCmd = &cobra.Command{
	Use:   "recreate",
	Short: "Destroys the database container and recreates it",
	Run: func(cmd *cobra.Command, args []string) {
		// Your recreate logic here
	},
}

var dbDropConnectionsCmd = &cobra.Command{
	Use:   "drop_connections",
	Short: "Drops idle connections from the database",
	Run: func(cmd *cobra.Command, args []string) {
		// Your drop connections logic here
	},
}

var dbCleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Deletes all rows from specified tables and performs cleanup",
	Run: func(cmd *cobra.Command, args []string) {
		// Your clean logic here
	},
}

func init() {
	DBCommand.AddCommand(dbSeedCommand)
	DBCommand.AddCommand(DBMigrateCmd)
	DBCommand.AddCommand(dbRecreateCmd)
	DBCommand.AddCommand(dbDropConnectionsCmd)
	DBCommand.AddCommand(dbCleanCmd)

}

func dbMigrate() {

	command := "docker-compose"
	comArgs := []string{"-f", "docker-compose.backend.yml", "start", "db_migrate"}

	// #nosec G204 // We have sanitized the command, so we can ignore this warning
	cmd := exec.Command(command, comArgs[0:]...)
	cmd.Env = os.Environ()

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
	var exitOK bool
	for {
		time.Sleep(500 * time.Millisecond)                                //TODO sleep elsewhere.../
		exitMatch, _ := checkIfContainerHasExited(dbMigrateContainer, "") //
		if exitMatch != nil {
			if *exitMatch == "0" {
				exitOK = true
			} else {
				exitOK = false
			}
			continue
		}
	}
	fmt.Print("Migrate completed. Exit Ok? %v", exitOK)

}

func checkIfContainerHasExited(container MintDockerContainerName, regexPattern string) (*string, error) {

	// psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a") //This shows the status of all containers
	// psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--status", "exited", "|", "grep", string(container)) // only get logs where the container has exited
	psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--status", "exited") // only get logs where the container has exited

	psOutput, err := psCmd.Output() //TODO, get the output better, there is an error with this. Maybe it's Grep? Should we do that in GO intead?

	if err != nil {
		return nil, fmt.Errorf("error checking container status: %v", err)
	}
	regexPattern = `Exited \((\d+)\)` //TODO: verify, we might only need this regex to check any containers exit status

	status := string(psOutput)
	match := regexp.MustCompile(regexPattern).FindStringSubmatch(status)
	if match != nil {
		return &match[0], nil
	}
	return nil, nil

}
