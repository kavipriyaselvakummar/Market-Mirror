from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

from . import models, database
from .routers import (
    products, prices, demand, trends, 
    recommendations, alerts, risk, query
)

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Market Mirror AI")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files & Templates
script_dir = os.path.dirname(__file__)
app.mount("/static", StaticFiles(directory=os.path.join(script_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(script_dir, "templates"))

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
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
