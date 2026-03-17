package main

import (
	"fmt"
	"os"

	faktory "github.com/contribsys/faktory/client"
	"github.com/spf13/cobra"
)

var workerCmd = &cobra.Command{
	Use:   "worker",
	Short: "Manage MINT Faktory workers",
	Long:  `Manage MINT Faktory workers`,
}

var pushJobCmd = &cobra.Command{
	Use:   "push-job [job-type]",
	Short: "Push a job onto the Faktory critical queue",
	Long:  `Push a job onto the Faktory critical queue by job type name`,
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
	workerCmd.AddCommand(pushJobCmd)
}
