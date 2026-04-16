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
	Use:   "push-job [job-type] [args...]",
	Short: "Push a job onto the Faktory critical queue",
	Long:  "Push a job onto the Faktory critical queue by job type name",
	Args:  cobra.MinimumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		jobType := args[0]
		jobArgs := args[1:]

		client, err := faktory.Open()
		if err != nil {
			fmt.Printf("failed to connect to Faktory: %v\n", err)
			os.Exit(1)
		}
		defer client.Close()

		// Faktory job arguments are JSON-serializable values. For the dev helper we treat
		// CLI args as strings; job handlers typically accept strings via fmt.Sprint.
		interfaces := make([]any, 0, len(jobArgs))
		for _, a := range jobArgs {
			interfaces = append(interfaces, a)
		}

		// Faktory protocol requires the `args` parameter to be present.
		// The contribsys client may omit `args` entirely when no variadic args are provided,
		// which causes errors like:
		//   "unknown: ERR jobs must have an args parameter"
		//
		// To keep dev pushing simple, ensure `args` exists even when the user doesn't
		// provide any job args.
		if len(jobArgs) == 0 {
			interfaces = []any{""}
		}

		if len(jobArgs) > 0 {
			fmt.Printf("pushing job %q with args: %v\n", jobType, jobArgs)
		} else {
			fmt.Printf("pushing job %q with default empty args\n", jobType)
		}

		job := faktory.NewJob(jobType, interfaces...)
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
