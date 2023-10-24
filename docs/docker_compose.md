# Docker Compose File Structure and Usage

`scripts/dev` and parts of our CI tooling rely on docker-compose. Multiple
docker-compose files exist to support different use cases and environments.

| File                          | Description                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [docker-compose.backend.yml](../docker-compose.backend.yml)   | Configuration for running the backend services locally. |
| [docker-compose.frontend.yml](../docker-compose.frontend.yml)   | Configuration for running the frontend services locally. |
## Use case: Run database and database migrations locally

Use the following command if you only intend to run the database and database
migration containers locally:

```console
$ docker-compose up --detach db db_migrate
Creating mint-app_db_1 ... done
Creating mint-app_db_migrate_1 ... done
```

By default, Docker Compose reads two files, a docker-compose.yml and an optional
docker-compose.override.yml file. That's why, for the above command, you don't
need to specify which compose files to use.

Two options to take it down:

```console
docker-compose kill  # stops the running containers
docker-compose down  # stops and also removes the containers
```

You can also force rebuilding the images (e.g. after using `kill`) with
`docker-compose build`.

## Use case: Run database, database migrations, backend, and frontend locally

Use the following to run the database, database migrations, backend server, and frontend client locally in docker.

```console
COMPOSE_HTTP_TIMEOUT=120 docker-compose up --profile frontend --build
```

Run the following to shut it down:

```console
docker-compose --profile frontend down
```
