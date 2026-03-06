from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String, nullable=False)
    your_platform = Column(String)
    your_price = Column(Float)
    min_margin = Column(Float)
    competitor_platforms = Column(String)  # comma-separated values
    created_at = Column(DateTime, default=datetime.utcnow)

    # Note: adding relationships for easier queries (optional but recommended)
    competitor_prices = relationship("CompetitorPrice", back_populates="product", cascade="all, delete")
    price_trends = relationship("PriceTrend", back_populates="product", cascade="all, delete")
    demand_metrics = relationship("DemandMetric", back_populates="product", cascade="all, delete")

class CompetitorPrice(Base):
    __tablename__ = "competitor_prices"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    platform = Column(String)
    price = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="competitor_prices")

class PriceTrend(Base):
    __tablename__ = "price_trends"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    platform = Column(String)
    day_label = Column(String)  # e.g., "Day 1", "Day 2"
    price = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="price_trends")

class DemandMetric(Base):
    __tablename__ = "demand_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    avg_rating = Column(Float)
    total_reviews = Column(Integer)
    monthly_growth = Column(Float)
    demand_level = Column(String)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="demand_metrics")

