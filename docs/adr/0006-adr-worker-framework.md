# Worker Server Framework to Process Background Jobs and Scheduled Jobs

Background job architecture is an important part of a large scale application.
A worker server that can run long running jobs, asynchronous processes, scheduled jobs, etc.
helps take load and latency off of the application server.

## Considered Alternatives

* [Faktory](https://github.com/contribsys/faktory)
* [Asynq](https://github.com/hibiken/asynq)
* [Cadence](https://github.com/uber/cadence)

## Decision Outcome
### Chosen Alternative: [Faktory](https://github.com/contribsys/faktory)
* Redis not needed initially.
* Dedicated worker server.
* Ease of deploying server to ECS.
* Paid features are worth the cost.

## Pros and Cons of the Alternatives <!-- optional -->

### [Faktory](https://github.com/contribsys/faktory)

* `+` Maintained/Large user base
* `+` Easy to install using [Docker](https://github.com/contribsys/faktory/wiki/Docker) / [ECS](https://github.com/contribsys/faktory/wiki/AWS-ECS)
* `+` Language agnostic
* `+` Dedicated worker server
* `+` Retry Jobs
* `+` Queuing with Priority Queues
* `+` Web UI dashboard
* `+` Scheduled Jobs (e.g. perform 1 hour form now )
* `+` Use local memory store to store jobs. Optional Redis Store (Paid feature)
* `-` Paid "Enterprise" Features" $199/Month
* `+/-` [Cron Jobs](https://github.com/contribsys/faktory/wiki/Ent-Cron) ($)
* `+/-` [Unique Jobs](https://github.com/contribsys/faktory/wiki/Ent-Unique-Jobs) ($)
* `+/-` [Expiring Jobs](https://github.com/contribsys/faktory/wiki/Ent-Expiring-Jobs) ($)
* `+/-` [Redis Gateway](https://github.com/contribsys/faktory/wiki/Ent-Redis-Gateway) ($)
* `+/-` [Queue Throttling](https://github.com/contribsys/faktory/wiki/Ent-Throttling) ($)
* `+/-` [Batch Jobs](https://github.com/contribsys/faktory/wiki/Ent-Batches) ($)
* `+/-` Dedicated Support ($)

### [Asynq](https://github.com/hibiken/asynq)

* `+` Maintained/Large user base
* `+` Retry Jobs
* `+` Queuing with Priority Queues
* `+` Web UI dashboard
* `+` Scheduled Jobs (e.g. perform 1 hour form now )
* `+` Periodic Tasks (Cron Jobs)
* `-` No dedicated worker server
* `-` Requires Redis

### [Cadence](https://github.com/uber/cadence)

* `+` Maintained/Large user base
* `+` Dedicated worker server
* `+` Scheduled Jobs
* `+` Periodic Jobs
* `+` Batch Jobs
* `-` More geared towards scheduled jobs only.
* `-` Overly complex and too narrow for our use case.
