from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.audio_router import router as audio_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

def configure_routers(app=app):
    api.get("/health-check")(lambda: {"Hello": "World"})
    api.include_router(audio_router)

    app.include_router(api)

configure_routers()
