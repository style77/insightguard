from fastapi import FastAPI

from insightguard.services.insightguard.model import BullyingScanner


def init_models(app: FastAPI) -> None:
    app.state.scanner = type("Scanner", (), {})

    app.state.scanner.langs = ["pl", "en", "jp", "sp", "ca"]
