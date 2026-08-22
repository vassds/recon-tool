import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base, async_session
from app.api import auth, projects, targets, scans, assets, reports, osint, settings as settings_router

app_settings = get_settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup."""
    logger.info("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created.")
    yield
    await engine.dispose()


app = FastAPI(
    title="Recon Platform",
    description="Professional cybersecurity reconnaissance platform for CTFs, labs, and authorized pentests.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(targets.router)
app.include_router(scans.router)
app.include_router(assets.router)
app.include_router(reports.router)
app.include_router(osint.router)
app.include_router(settings_router.router)


@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}
