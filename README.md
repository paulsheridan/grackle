# Grackle Tattoo Scheduling

A scheduling and booking application for tattoo artists.

## Technology Stack and Features

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python backend API.
  - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
  - 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for the data validation and settings management.
  - 💾 [PostgreSQL](https://www.postgresql.org) as the SQL database.
- 🐋 [Docker Compose](https://www.docker.com) for development and production.
- 🔑 JWT token authentication.
- 📫 Email based password recovery.
- ✅ Tests with [Pytest](https://pytest.org).

## Requirements

- [Docker](https://www.docker.com/).
- [Poetry](https://python-poetry.org/) for Python package and environment management.

## Local Development

- Start the stack with Docker Compose:

```bash
make up
```

- Follow the backend logs:

```bash
make follow
```

Interact with API: http://localhost:8888/api/v1

Automatic interactive documentation with Swagger UI (from the OpenAPI backend): http://localhost:8888/docs

To check the logs, run:

```bash
docker compose logs
```

To check the logs of a specific service, add the name of the service, e.g.:

```bash
docker compose logs backend
```

### General workflow

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/` you can install all the dependencies with:

```console
$ poetry install
```

Then you can start a shell session with the new environment with:

```console
$ poetry shell
```
