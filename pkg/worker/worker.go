package worker

import (
	"fmt"

	faktory_worker "github.com/contribsys/faktory_worker_go"
)

// Work creates, configues, and starts worker
func Work() {
	// create manager
	mgr := faktory_worker.NewManager()
	mgr.Concurrency = 20
	// pull jobs from these queues, in this order of precedence
	mgr.ProcessStrictPriorityQueues("critical", "default")

	// register jobs here
	// e.g. mgr.Register("SomeJob", someFunc)
	// mgr.Register("Analyze Job", NewAnalyzedModelChangeJob)

	err := mgr.Run()
	if err != nil {
		fmt.Println(err)
	}
}

/*
Put registered functions here:
e.g.

	func someFunc(ctx context.Context, args ...interface{}) error {
		help := faktory_worker.HelperFor(ctx)
		log.Printf("Working on job %s\n", help.Jid())
		time.Sleep(1 * time.Second)
		return nil
	}
*/
