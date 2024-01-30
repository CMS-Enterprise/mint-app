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

// Container represents the structure of a Docker container
type Container struct {
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

func checkIfContainerHasExited(container MintDockerContainerName, regexPattern string) (*string, error) {
	containers, err := getExitedDockerContainers()
	if err != nil {
		return nil, nil
	}
	containerToCheck := containers[string(container)]
	//TODO: do a nil check, this will create a record if it doesn't exist

	return models.StringPointer(fmt.Sprint(containerToCheck.ExitCode)), nil

	// psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format", "json")
	// // psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format", "'json'", "--help")
	// // psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format json") //, "{json }")
	// output, err := psCmd.Output()
	// if err != nil {
	// 	fmt.Println("Error running docker-compose ps:", err)
	// 	return nil, err
	// }
	// // Wrap the output in a JSON array
	// jsonArrayString := "[" + string(output) + "]"

	// //TODO, determine how to parse each of these in a valid way.
	// // Right now there is an error Error parsing JSON: invalid character '{' after array element
	// outputString := string(output)

	// fmt.Println("Ran command:", psCmd.String())

	// fmt.Println("Command output:", outputString)
	// exitedContainers := make(map[string]Container)

	// lines := strings.Split(string(outputString), "\n")
	// for _, line := range lines {
	// 	if line == "" {
	// 		continue
	// 	}

	// 	var container Container
	// 	err := json.Unmarshal([]byte(line), &container)
	// 	if err != nil {
	// 		fmt.Println("Error parsing JSON:", err)
	// 		continue
	// 	}

	// 	exitedContainers[container.Name] = container
	// }
	// fmt.Print(exitedContainers)

	// var containers []Container
	// // errUnmarshal := json.Unmarshal(output, &containers)
	// errUnmarshal := json.Unmarshal([]byte(jsonArrayString), &containers)
	// if errUnmarshal != nil {
	// 	fmt.Println("Error parsing JSON:", errUnmarshal)
	// 	return nil, errUnmarshal
	// }
	// // var containers []ContainerStatus
	// // errUnmarshal := json.Unmarshal(output, &containers)
	// // if errUnmarshal != nil {
	// // 	fmt.Println("Error parsing JSON:", errUnmarshal)
	// // 	return nil, errUnmarshal
	// // }
	// // psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a") //This shows the status of all containers
	// // psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--status", "exited", "|", "grep", string(container)) // only get logs where the container has exited
	// // psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--status", "exited") // only get logs where the container has exited
	// // psCmd2 := exec.Command("grep", string(container))
	// // psCmd2.Stdin, _ = psCmd.StdoutPipe()

	// // psCmd.Start()
	// // // psCmd2.Start()
	// // // Wait for cmd1 to finish
	// // if err := psCmd.Wait(); err != nil {
	// // 	fmt.Println("Error waiting for cmd1:", err)
	// // 	return nil, err
	// // }

	// // psOutput, err := psCmd2.Output() //TODO, get the output better, there is an error with this. Maybe it's Grep? Should we do that in GO intead?

	// if err != nil {
	// 	return nil, fmt.Errorf("error checking container status: %v", err)
	// }
	// regexPattern = `Exited \((\d+)\)` //TODO: verify, we might only need this regex to check any containers exit status

	// // status := string(psOutput)
	// status := string(containers[0].Status) //TODO get the right container or do this elsewhere
	// match := regexp.MustCompile(regexPattern).FindStringSubmatch(status)
	// if match != nil {
	// 	return &match[0], nil
	// }
	// return nil, nil

}

func getExitedDockerContainers() (map[string]Container, error) {
	psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format", "json")
	// psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format", "'json'", "--help")
	// psCmd := exec.Command("docker-compose", "-f", "docker-compose.backend.yml", "ps", "-a", "--format json") //, "{json }")
	output, err := psCmd.Output()
	if err != nil {
		fmt.Println("Error running docker-compose ps:", err)
		return nil, err
	}

	//TODO, determine how to parse each of these in a valid way.
	// Right now there is an error Error parsing JSON: invalid character '{' after array element
	outputString := string(output)

	fmt.Println("Ran command:", psCmd.String())

	fmt.Println("Command output:", outputString)
	exitedContainers := make(map[string]Container)

	lines := strings.Split(string(outputString), "\n")
	for _, line := range lines {
		if line == "" {
			continue
		}

		var container Container
		err := json.Unmarshal([]byte(line), &container)
		if err != nil {
			fmt.Println("Error parsing JSON:", err)
			continue
		}

		exitedContainers[container.Name] = container
	}
	return exitedContainers, nil

}
