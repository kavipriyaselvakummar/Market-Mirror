from sqlalchemy.orm import Session
from . import models, schemas, simulator
import statistics

def create_product(db: Session, product_data: schemas.ProductCreate):
    comp_platforms_str = ",".join(product_data.competitor_platforms)
    db_product = models.Product(
        product_name=product_data.product_name,
        your_platform=product_data.your_platform,
        your_price=product_data.your_price,
        min_margin=product_data.min_margin,
        competitor_platforms=comp_platforms_str
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Trigger simulators
    simulator.simulate_competitor_prices(db_product.id, db_product.your_price, product_data.competitor_platforms, db)
    simulator.simulate_price_trends(db_product.id, db_product.your_price, product_data.competitor_platforms, db)
    simulator.simulate_demand_metrics(db_product.id, db)
    
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_competitor_prices(db: Session, product_id: int):
    return db.query(models.CompetitorPrice).filter(models.CompetitorPrice.product_id == product_id).all()

def get_price_trends(db: Session, product_id: int):
    trends = db.query(models.PriceTrend).filter(models.PriceTrend.product_id == product_id).all()
    grouped = {}
    for t in trends:
        if t.platform not in grouped:
            grouped[t.platform] = {"prices": [], "day_labels": []}
        grouped[t.platform]["prices"].append(t.price)
        grouped[t.platform]["day_labels"].append(t.day_label)
    return grouped

def get_demand_metrics(db: Session, product_id: int):
    return db.query(models.DemandMetric).filter(models.DemandMetric.product_id == product_id).order_by(models.DemandMetric.recorded_at.desc()).first()

def refresh_all_data(db: Session, product_id: int):
    product = get_product(db, product_id)
    if not product:
        return {"error": "Product not found"}
    platforms = product.competitor_platforms.split(",") if product.competitor_platforms else []
    
    simulator.simulate_competitor_prices(product.id, product.your_price, platforms, db)
    simulator.simulate_price_trends(product.id, product.your_price, platforms, db)
    simulator.simulate_demand_metrics(product.id, db)
    
    return {"message": "Data refreshed successfully"}

def calculate_ai_recommendation(db: Session, product_id: int):
    product = get_product(db, product_id)
    comp_prices = get_competitor_prices(db, product_id)
    
    if not comp_prices or not product:
        return None
        
    prices = [p.price for p in comp_prices]
    market_avg = sum(prices) / len(prices)
    
    metrics = get_demand_metrics(db, product_id)
    demand_factor = 1.0
    if metrics:
        if metrics.demand_level == "Low": demand_factor = 0.95
        elif metrics.demand_level == "High": demand_factor = 1.08
        
    min_acceptable = product.your_price * (1 + product.min_margin / 100)
    suggested_raw = market_avg * demand_factor
    suggested_price = round(max(suggested_raw, min_acceptable), 2)
    
    reason = f"Based on {metrics.demand_level if metrics else 'Normal'} demand and market average of {market_avg:.2f}. "
    if suggested_price <= min_acceptable:
        reason += "Price set at a level to maintain your minimum margin."
    else:
        reason += "Optimized for market competitiveness and growth."
        
    return {
        "market_avg_price": round(market_avg, 2),
        "your_price": product.your_price,
        "suggested_price": suggested_price,
        "reason": reason
    }

def calculate_alerts(db: Session, product_id: int):
    product = get_product(db, product_id)
    comp_prices = get_competitor_prices(db, product_id)
    
    alerts = []
    if not product: return alerts
    
    for cp in comp_prices:
        diff = cp.price - product.your_price
        pct = (diff / product.your_price) * 100
        
        if pct < -15:
            risk, impact, shift = "High", "High", "35-45% of buyers may shift"
            action = "Urgent: Drop price to match market leaders."
        elif pct < -5:
            risk, impact, shift = "Medium", "Medium", "15-25% of buyers may shift"
            action = "Warning: Consider price adjustment to stay competitive."
        else:
            risk, impact, shift = "Low", "Low", "Minimal customer impact"
            action = "Maintain current pricing strategy."
            
        alerts.append({
            "platform": cp.platform,
            "price_difference": round(diff, 2),
            "price_difference_pct": round(pct, 2),
            "competitiveness_impact": impact,
            "customer_shift_risk": shift,
            "recommended_action": action,
            "risk_level": risk
        })
    return alerts

def calculate_risk(db: Session, product_id: int):
    product = get_product(db, product_id)
    comp_prices = get_competitor_prices(db, product_id)
    
    if not product: return None
    
    cheaper_count = sum(1 for cp in comp_prices if cp.price < product.your_price)
    total = len(comp_prices) if comp_prices else 1
    
    active_sellers = simulator.simulate_active_sellers()
    competition_score = int((cheaper_count/total) * 60 + (active_sellers/45) * 40)
    
    level = "Low"
    if competition_score > 65: level = "High"
    elif competition_score > 35: level = "Medium"
    
    return {
        "active_sellers": active_sellers,
        "competition_level": level,
        "price_war_risk": level,
        "competition_score": competition_score
    }

