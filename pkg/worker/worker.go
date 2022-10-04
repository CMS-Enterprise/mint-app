package worker

import (
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

	mgr.Run()

}
