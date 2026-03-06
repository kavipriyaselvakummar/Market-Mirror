from pydantic import BaseModel
from typing import List
from datetime import datetime

class ProductCreate(BaseModel):
    product_name: str
    your_platform: str
    your_price: float
    min_margin: float
    competitor_platforms: List[str]

class ProductResponse(BaseModel):
    id: int
    product_name: str
    your_platform: str
    your_price: float
    min_margin: float
    competitor_platforms: List[str]
    created_at: datetime

    class Config:
        orm_mode = True

class CompetitorPriceResponse(BaseModel):
    platform: str
    price: float
    difference: float
    status: str

class TrendResponse(BaseModel):
    platform: str
    prices: List[float]
    day_labels: List[str]
    price_change: float
    trend: str
    possible_reason: str

class DemandMetricsResponse(BaseModel):
    avg_rating: float
    total_reviews: int
    monthly_growth: float
    demand_level: str
    summary: str

class AIRecommendationResponse(BaseModel):
    market_avg_price: float
    your_price: float
    suggested_price: float
    reason: str

class AlertResponse(BaseModel):
    platform: str
    price_difference: float
    price_difference_pct: float
    competitiveness_impact: str
    customer_shift_risk: str
    recommended_action: str
    risk_level: str

class RiskResponse(BaseModel):
    active_sellers: int
    competition_level: str
    price_war_risk: str
    competition_score: int

class QueryRequest(BaseModel):
    product_id: int
    question: str

class QueryResponse(BaseModel):
    answer: str

