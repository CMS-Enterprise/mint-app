package command

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/spf13/cobra"

	"github.com/cmsgov/mint-app/pkg/models"
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
		exitMatch, _ := checkIfContainerHasExited(dbMigrateContainer, "") //TODO: rework this to check better
		if exitMatch != nil {
			if *exitMatch == "0" {
				exitOK = true
			} else {
				exitOK = false
			}
			break
		}
	}
	fmt.Print("Migrate completed. Exit Ok? %", exitOK)

}

// ContainerStatus represents the status of all docker containers
type ContainerStatus struct {
	Name   string `json:"name"`
	Status string `json:"status"`
}

// DockerContainer represents the structure of a Docker container
type DockerContainer struct {
	ID         string `json:"ID"`
	Name       string `json:"Name"`
	Image      string `json:"Image"`
	Command    string `json:"Command"`
	Project    string `json:"Project"`
	Service    string `json:"Service"`
	Created    int64  `json:"Created"`
	State      string `json:"State"`
	Status     string `json:"Status"`
	Health     string `json:"Health"`
	ExitCode   int    `json:"ExitCode"`
	Publishers []struct {
		URL           string `json:"URL"`
		TargetPort    int    `json:"TargetPort"`
		PublishedPort int    `json:"PublishedPort"`
		Protocol      string `json:"Protocol"`
	} `json:"Publishers"`
}

// DockerContainers holds docker container information from docker-compose
type DockerContainers struct {
	Containers map[MintDockerContainerName]*DockerContainer
}

// GetContainer returns a docker container if present by service name
func (dc *DockerContainers) GetContainer(name MintDockerContainerName) (*DockerContainer, error) {
	//TODO: check if present, if not return an error. Currently this will never return an error
	return dc.Containers[name], nil
}

func checkIfContainerHasExited(container MintDockerContainerName, regexPattern string) (*string, error) {
	containers, err := getDockerContainersStatus()
	if err != nil {
		return nil, err
	}
	containerToCheck, err := containers.GetContainer(container)
	if err != nil {
		return nil, err
	}
	//TODO: do a nil check, this will create a record if it doesn't exist

	return models.StringPointer(fmt.Sprint(containerToCheck.ExitCode)), nil

}

func getDockerContainersStatus() (*DockerContainers, error) {
	dockerContainers := DockerContainers{}
	psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format", "json")
	output, err := psCmd.Output()
	if err != nil {
		fmt.Println("Error running docker-compose ps:", err)
		return nil, err
	}

	outputString := string(output)

	fmt.Println("Ran command:", psCmd.String())

	fmt.Println("Command output:", outputString)
	containers := make(map[MintDockerContainerName]*DockerContainer)

	lines := strings.Split(string(outputString), "\n")
	for _, line := range lines {
		if line == "" {
			continue
		}

		var container DockerContainer
		err := json.Unmarshal([]byte(line), &container)
		if err != nil {
			fmt.Println("Error parsing JSON:", err)
			continue
		}
		//TODO: make this a map of enums of container names, the container name doesn't match the docker config exactly.

		containers[MintDockerContainerName(container.Service)] = &container
	}
	dockerContainers.Containers = containers
	return &dockerContainers, nil

}
