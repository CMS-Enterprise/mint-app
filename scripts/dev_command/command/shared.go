package command

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"
)

// TODO verify this, came from tool
func waitForSuccess(message string, command ...string) {
	fmt.Print(message)
	for {
		cmd := exec.Command(command[0], command[1:]...)
		_, err := cmd.CombinedOutput()
		// output, err := cmd.CombinedOutput()
		if err == nil {
			break
		}
		fmt.Print(".")
		time.Sleep(3 * time.Second)
	}
	fmt.Println(" ✨ done ✨")
}

// TODO verify this, came from tool
func contribsysDockerLogin() {
	attemptCmd := exec.Command("docker", "pull", "docker.contribsys.com/contribsys/faktory-ent:latest")
	attemptOutput, err := attemptCmd.CombinedOutput()
	if strings.Contains(string(attemptOutput), "no basic auth credentials") {
		fmt.Println("🔐 Login to docker.contribsys.com (creds are in 1Password) 🔐")
		loginCmd := exec.Command("docker", "login", "docker.contribsys.com")
		loginCmd.Stdout = os.Stdout
		loginCmd.Stderr = os.Stderr
		err := loginCmd.Run()
		if err != nil {
			log.Fatal(err)
		}
	} else if err != nil {
		log.Fatal(err)
	}
}
