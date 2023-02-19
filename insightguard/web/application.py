from importlib import metadata

from fastapi import FastAPI
from fastapi.responses import UJSONResponse

from insightguard.web.api.router import api_router
from insightguard.web.lifetime import register_shutdown_event, register_startup_event
from insightguard.web.middlewares import ProcessTimeHeader


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    app = FastAPI(
        title="insightguard",
        version=metadata.version("insightguard"),
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )

    # Adds startup and shutdown events.
    register_startup_event(app)
    register_shutdown_event(app)

    app.add_middleware(ProcessTimeHeader)

    # Main router for the API.
    app.include_router(router=api_router, prefix="/api")

    return app
