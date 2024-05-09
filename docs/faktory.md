# 🏭 Faktory 🏭
[Faktory](https://github.com/contribsys/faktory) is our worker server that queues background jobs for processing.

### There are 3 parts to Faktory
1. The [Faktory Server](https://github.com/contribsys/faktory) is a standalone work server that queues jobs for workers to fetch and execute.
3. The [Faktory Client](https://github.com/contribsys/faktory/blob/main/client/client.go) handles server config/stats and pushing jobs.
2. The [Faktory Worker](https://github.com/contribsys/faktory_worker_go) handles fetching and processing jobs from the Faktory Server.

### What should be a background job?
- Anything and everything that can be done asynchronously.
  - Sending emails/notifications
  - Data processing
  - Report/File generation
  - Long running processes
  - CPU intensive tasks
  - Scheduled tasks
  - Ask yourself - "Can/Should this feature be done in the background? 🤔"
s
## 🏗 Config

### 🚢 Ports
**NOTE:** These ports are password protected in `production` set by the `FAKTORY_PASSWORD` environment variable.

1. `7419` - A `TCP` connection that the [Faktory Worker Protocol (FWP)](https://github.com/contribsys/faktory/blob/main/docs/protocol-specification.md) server listens on.
2. `7420` - The Web UI.
  - The web UI is  accessible in deployed environments as well. You just need to look up the DNS name (A Record) from the load balancer in AWS. You will still need the `FAKTORY_PASSWORD` to view the UI.
    

### 🎛 Environment Variables
Faktory Server:
- `FAKTORY_ENV`: The environment to start the server in: `development` (default), `staging`, or `production`.\
   **NOTE:** We only pay for connections used on `production` servers. Other environments have limitations: [Faktory Docs](https://github.com/contribsys/faktory/wiki/Administration).

- `FAKTORY_LICENSE`: The enterprise license key.
- `REDIS_URL`: The URL to the remote Redis instance. [Faktory Docs](https://github.com/contribsys/faktory/wiki/Ent-Remote-Redis).

Faktory Server and MINT App:
- `FAKTORY_PASSWORD`: The password set to access ports 7419 and 7420.

MINT App:
- `FAKTORY_URL`: The `TCP` URL of the Faktory Server with the port the [FWP](https://github.com/contribsys/faktory/blob/main/docs/protocol-specification.md) is listening on e.g. `tcp://:{FAKTORY_PASSWORD}@faktory.example.com:7419`.
- `FAKTORY_CONNECTIONS`: Number of connection pools. Our license is limited to 100 connections across production environments.
- `FAKTORY_PROCESS_JOBS`: If queued jobs should be processed.

### ⏲ Cron Jobs
[Cron Jobs](https://github.com/contribsys/faktory/wiki/Ent-Cron) are configured using `.toml` files that are loaded into the server's config before serving:
- Production: `/etc/faktory/conf.d`
- Development: `~/.faktory/conf.d`

You can add as many `.toml` files as you want in `conf.d`.

Each `cron` job begins with `[[cron]]` element declaration.

```toml
# NOTE: Indentation does not matter but newlines do

[[cron]]
  schedule = "*/5 * * * *" # The schedule in crontab format
  [cron.job]
    type = "DailyDigestCronJob" # The job the that will get enqueued on schedule
    queue = "critical" # The queue to place the job in

[[cron]]
  schedule = "12 * * * *"
  [cron.job]
    type = "HourlyReport"
    retry = 3
```

### 💻 Local
Ensure `.envrc` and `.envrc.local` equate to (override default values in `.envrc.local`):
```bash
export FAKTORY_URL=tcp://faktory:7419
export FAKTORY_CONNECTIONS=20
export FAKTORY_PROCESS_JOBS=true
```

- docker-compose is used to set up and run the Faktory Server locally.
- The first time you run `scripts/dev up` it will ask you for username and password to `docker.contribsys.com`. These credentials are in 1Password.
- Web UI will be at `localhost:7420`.

#### Troubleshooting:
- Processes aren't running.
  - Ensure `FAKTORY_PROCESS_JOBS` is set to true
  - Ensure `FAKTORY_CONNECTIONS` is set to at least 15-20. If there aren't enough connections jobs could get "stuck".
  - Ensure that you are running in the `local` environment (`APP_ENV=local`).
  - Navigate to `localhost:7420/busy` and check the `Processes` section. If processes are running you should see something like:
    | ID              | Name                           | Started     | Connections | RSS  | Busy |
    | --------------- | ------------------------------ | ----------- | ----------- | ---- | ---- |
    | `5kjvidc2pd30a` |`ede07db6519a:1850 golang-1.6.0` |`2 mins ago` | `20`        | `0 KB` | `0` |
  - ☢️ Nuclear option - It may be necessary to clean docker and rebuild. Ensure your `mint-app` containers are stopped then run `docker system prune --volumes`


### 🧪 Testing
- Worker processes should **NOT** be running in `testing`.
- Ensure that tests are run in the `testing` environment `APP_ENV=testing scripts/dev test:go`

### 🚀 Production
#### **CRON Jobs:** 
   For local testing, the cron job is configured in `cron.toml`. However in deployed environments, the TOML is represented as a base64 encoded environment variable (`FAKTORY_CRON_TOML_BASE64`). To add the new cron job, `1.` Decode the current TOML from BASE64 `2.` Update the TOML to include the new cron job configuration `3.` Encode the updated TOML to BASE64. `4.` Upload the updated ENV file to the correct environment, and update the service (either update the service and force a new deployment, or trigger the pipeline)

   You can use the command line tool `base64` to encode and decode the string, or use a GUI tool. If you encrypt a file to use as the base64 string, make sure you first decode the existing TOML. The local `cron.toml` doesn't necessarily match what is deployed.

   ```
    "aGVsbG8K" | base64 --decode  
    hello

    echo Why hello there | base64 
    V2h5CmhlbGxvCnRoZXJlCg==

    for a file
    base64 -i .faktory/conf.d/cron.toml
    W1tjcm9uXV0KICBzY2hlZHVsZSA9ICIqLzUgKiAqICogKiIKICBbY3Jvbi5qb2JdCiAgICB0eXBlID0gIkRhaWx5RGlnZXN0Q3JvbkpvYiIKICAgIHF1ZXVlID0gImNyaXRpY2FsIgo=
   ```

#### Redis:
In deployed environments the Redis location is configured through the `REDIS_URL` environment variable.

#### License:
The Faktory license is provided through the `FAKTORY_LICENSE` environment variable.


Faktory Docs:
- [ECS](https://github.com/contribsys/faktory/wiki/AWS-ECS)
- [Installation](https://github.com/contribsys/faktory/wiki/Ent-Installation)
- [Docker](https://github.com/contribsys/faktory/wiki/Docker)

## ⚙️ Jobs

1. Create your job function. This is the function that will be called when your job is processed.
   - Parameters of `(ctx context.Context, args ...interface{})` are required. Nothing less, nothing more.
   - Pass your arguments in `args`. `args` must be `JSON` serializable.
   - Function must return type `error`.
      ```go
      func (w *Worker) MyJob(ctx context.Context, args ...interface{}) error {
        return nil
      }
      ```
2. Register your job in the `Work()` function located in [`pkg/worker/worker.go`](../pkg/worker/worker.go#L48):
   - Use function name as "name" of job to easily identify jobs when creating and pushing new jobs.
      ```go
      func (w *Worker) Work() {
          .
          .
          .

          mgr.Register("MyJob", w.MyJob)

          .
          .
          .
      }
      ```

3. Pushing jobs:
   - Inside app code. 🚨 This method should NOT be used inside another job 🚨:
      ```go
      import (
        faktory "github.com/contribsys/faktory/client"
      )

      client, err := faktory.Open()
      job := faktory.NewJob("MyJob", args)
      err = client.Push(job)

      // 🚨 client instances are NOT safe to share. 🚨
      // If sharing is needed use a Pool of clients:

      pool, err := faktory.NewPool(5)
      if err != nil {
        return err
      }

      err = pool.With(func(cl *faktory.Client) error {
        job := faktory.NewJob("MyJob", args)
        return cl.Push(job)
      })
      ```
   - Inside of another job use context helper:
      ```go
      func(w *Worker) MyOtherJob(ctx context.Context, args ...interface{}) error {
        helper := worker.HelperFor(ctx)

        return helper.With(func(cl *faktory.Client) error {
          job := faktory.MyJob("MyJob", args)
          return cl.Push(job)
        })
      }
      ```
