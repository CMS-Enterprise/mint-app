package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/spf13/cobra"

	faktory "github.com/contribsys/faktory/client"
	worker "github.com/contribsys/faktory_worker_go"
)

// Worker functions that execute jobs
func sendEmail(ctx context.Context, args ...interface{}) error {
	time.Sleep(2 * time.Minute)
	help := worker.HelperFor(ctx)
	log.Printf("Working on job %s\n", help.Jid())
	return nil
}

var workerCmd = &cobra.Command{
	Use:   "worker",
	Short: "Set up the Faktory worker",
	Long:  "Set up the Faktory worker",
	Run: func(cmd *cobra.Command, args []string) {
		mgr := worker.NewManager()

		// register job types and the function to execute them
		mgr.Register("SendEmailJob", sendEmail)
		//mgr.Register("AnotherJob", anotherFunc)

		// use up to N goroutines to execute jobs
		mgr.Concurrency = 20

		// pull jobs from these queues, in this order of precedence
		mgr.ProcessStrictPriorityQueues("critical", "default", "email")

		// Start processing jobs
		mgr.Run()
	},
}

// Push something for us to work on.
func send(mgr *worker.Manager) {
	job := faktory.NewJob("SendEmailJob", "hello")

	err := mgr.Pool.With(func(cl *faktory.Client) error {
		return cl.Push(job)
	})
	if err != nil {
		fmt.Printf("send: %v\n", err)
	}
}
