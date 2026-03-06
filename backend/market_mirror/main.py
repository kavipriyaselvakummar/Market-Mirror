from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models, database
from .routers import (
    products, prices, demand, trends,
    recommendations, alerts, risk, query
)

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Market Mirror AI")

# CORS — allow React dev server (port 5173-5175)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with /api prefix
app.include_router(products.router, prefix="/api")
app.include_router(prices.router, prefix="/api")
app.include_router(demand.router, prefix="/api")
app.include_router(trends.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(query.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "Market Mirror AI backend is running", "docs": "/docs"}
