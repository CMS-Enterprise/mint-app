// Package main is the entrypoint for command line execution of MINT worker helpers.
package main

import (
	"fmt"
	"os"

	faktory "github.com/contribsys/faktory/client"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "worker",
	Short: "MINT worker helper commands",
	Long:  "MINT worker helper commands (dev-only).",
}

var pushJobCmd = &cobra.Command{
	Use:   "push-job [job-type]",
	Short: "Push a job onto the Faktory critical queue",
	Long:  "Push a job onto the Faktory critical queue by job type name",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		jobType := args[0]

		client, err := faktory.Open()
		if err != nil {
			fmt.Printf("failed to connect to Faktory: %v\n", err)
			os.Exit(1)
		}
		defer client.Close()

		job := faktory.NewJob(jobType, []interface{}{}...)
		job.Queue = "critical"

		if err := client.Push(job); err != nil {
			fmt.Printf("failed to push job %q: %v\n", jobType, err)
			os.Exit(1)
		}

		fmt.Printf("pushed job %q (jid: %s) to critical queue\n", jobType, job.Jid)
	},
}

func init() {
	rootCmd.AddCommand(pushJobCmd)
}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func main() {
	execute()
}
