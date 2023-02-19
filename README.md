# insightguard

InsightGuard is a simple API, that can be used to predict if message is considered as cyberbullying or not.

Models are trained in 5 languages: English, Polish, Japanese, Spanish, Catalan.

Project is easily scalable to perform predictions in other languages, and to create new features.

Project structure was generated using awesome [fastapi_template](https://github.com/s3rius/FastAPI-template/).

## Poetry

This project uses poetry. It's a modern dependency management
tool.

To run the project use this set of commands:

```bash
poetry install
poetry run python -m insightguard
```

This will start the server on the configured host.

You can find swagger documentation at `/api/docs`.

You can read more about poetry here: https://python-poetry.org/

## Docker

You can start the project with docker using this command:

```bash
docker-compose -f deploy/docker-compose.yml --project-directory . up --build
```

If you want to develop in docker with autoreload add `-f deploy/docker-compose.dev.yml` to your docker command.
Like this:

```bash
docker-compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml --project-directory . up
```

This command exposes the web application on port 8000, mounts current directory and enables autoreload.

But you have to rebuild image every time you modify `poetry.lock` or `pyproject.toml` with this command:

```bash
docker-compose -f deploy/docker-compose.yml --project-directory . build
```

## Configuration

This application can be configured with environment variables.

You can create `.env` file in the root directory and place all
environment variables here.

All environment variables should start with "INSIGHTGUARD_" prefix.

For example if you see in your "insightguard/settings.py" a variable named like
`random_parameter`, you should provide the "INSIGHTGUARD_RANDOM_PARAMETER"
variable to configure the value. This behaviour can be changed by overriding `env_prefix` property
in `insightguard.settings.Settings.Config`.

An example of .env file:
```bash
INSIGHTGUARD_RELOAD="True"
INSIGHTGUARD_PORT="8000"
INSIGHTGUARD_ENVIRONMENT="dev"

INSIGHTGUARD_JWT_SECRET_KEY="secret_key"
INSIGHTGUARD_JWT_REFRESH_SECRET_KEY="refresh_token"
```

You can read more about BaseSettings class here: https://pydantic-docs.helpmanual.io/usage/settings/

## Migrations

If you want to migrate your database, you should run following commands:
```bash
# To run all migrations untill the migration with revision_id.
alembic upgrade "<revision_id>"

# To perform all pending migrations.
alembic upgrade "head"
```

### Reverting migrations

If you want to revert migrations, you should run:
```bash
# revert all migrations up to: revision_id.
alembic downgrade <revision_id>

# Revert everything.
alembic downgrade base
```

### Migration generation

To generate migrations you should run:
```bash
# For automatic change detection.
alembic revision --autogenerate

# For empty file generation.
alembic revision
```


## Running tests

If you want to run it in docker, simply run:

```bash
docker-compose -f deploy/docker-compose.yml --project-directory . run --rm api pytest -vv .
docker-compose -f deploy/docker-compose.yml --project-directory . down
```

For running tests on your local machine.
1. you need to start a database. For example with docker:
```bash
docker run -p "5432:5432" -e "POSTGRES_PASSWORD=insightguard" -e "POSTGRES_USER=insightguard" -e "POSTGRES_DB=insightguard" postgres:13.8-bullseye
```

2.Run the pytest.
```bash
pytest -vv .
```

## Contributing

If you want to contribute to this project, feel free to open a pull request.

## License

This project is licensed under the terms of the MIT license.
