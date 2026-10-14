from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import hotspots, copilot

app = FastAPI(
    title="SentinelX AI Engine",
    description="Python FastAPI engine for Machine Learning models and analytics.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=".*",
)

@app.get("/health")
async def get_health():
    return {"status": "ok", "service": "sentinelx-ai-engine"}

# Include routers
app.include_router(hotspots.router, prefix="/api/v1/hotspots", tags=["Hotspots"])
app.include_router(copilot.router, prefix="/api/v1/copilot", tags=["Copilot"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
