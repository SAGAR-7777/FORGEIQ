import asyncio
import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from config import APP_NAME, PORT, HOST, BASE_DIR
from routers.api_router import router as api_router
from simulator import simulator


# Background task for live periodic sensor telemetry updates
async def simulation_loop():
    while True:
        try:
            await simulator.step_simulation()
        except Exception:
            pass
        await asyncio.sleep(2.5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: launch background simulator loop
    task = asyncio.create_task(simulation_loop())
    yield
    # Shutdown
    task.cancel()

app = FastAPI(
    title=APP_NAME,
    description="ForgeIQ - AI Manufacturing Quality Intelligence API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router first
app.include_router(api_router)

# Mount Frontend Dist if built
frontend_dist = BASE_DIR.parent / "frontend" / "dist"
if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    def serve_root():
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {
            "app": "FORGEIQ",
            "tagline": "Predict defects. Understand causes. Optimize production.",
            "api_docs": "/docs"
        }

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api":
            raise HTTPException(status_code=404, detail="API route not found")
        target_file = frontend_dist / full_path
        if target_file.is_file():
            return FileResponse(target_file)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def read_root():
        return {
            "app": "FORGEIQ",
            "tagline": "Predict defects. Understand causes. Optimize production.",
            "status": "operational",
            "api_docs": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
