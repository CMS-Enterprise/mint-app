package worker

import faktory_worker "github.com/contribsys/faktory_worker_go"

// JobWrapper is a utility struct that associated the name of a job with the function that will be called to execute the job
type JobWrapper struct {
	// The name of the Job to be registered with the faktory manager
	Name string
	// The code to be executed for this Job
	Job faktory_worker.Perform
}

// Changes: (Job) Is it possible to wrap everything like this? We are using receiver methods...
