from contextlib import asynccontextmanager
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routes import auth, rooms
from app.services.socket_manager import create_sio


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to initialize database during startup: {e}")
    yield


app = FastAPI(
    title="SyncFlix API",
    description="Real-time group streaming platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST routers
app.include_router(auth.router)
app.include_router(rooms.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "SyncFlix API"}


# Mount Socket.IO
sio = create_sio()
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# Export the combined ASGI app
# Run with: uvicorn app.main:socket_app --reload
