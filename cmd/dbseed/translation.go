package main

import (
	"log"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

var translationExportCmd = &cobra.Command{
	Use:   "tExport",
	Short: "translationExport",
	Long:  "translationExport",
	Run: func(cmd *cobra.Command, args []string) {
		exportTranslation()
	},
}

func exportTranslation() {
	// yarn ts-node ./mappings/export/exportTranslation.ts

	command := "yarn"
	comArgs := []string{"ts-node", "./mappings/export/exportTranslation.ts"}

	// #nosec G204 // We have sanitized the command, so we can ignore this warning
	cmd := exec.Command(command, comArgs[0:]...)

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
