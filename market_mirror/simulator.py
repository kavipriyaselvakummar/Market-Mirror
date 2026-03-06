import random
from datetime import datetime
from .models import CompetitorPrice, PriceTrend, DemandMetric

def simulate_competitor_prices(product_id: int, user_price: float, platforms: list[str], db):
    db.query(CompetitorPrice).filter(CompetitorPrice.product_id == product_id).delete()
    
    results = []
    for platform in platforms:
        price = user_price * random.uniform(0.75, 1.25)
        price = round(price, 2)
        results.append({"platform": platform, "price": price})
        
        db_price = CompetitorPrice(
            product_id=product_id,
            platform=platform,
            price=price
        )
        db.add(db_price)
        
    db.commit()
    return results

def simulate_price_trends(product_id: int, user_price: float, platforms: list[str], db):
    db.query(PriceTrend).filter(PriceTrend.product_id == product_id).delete()
    
    # We first simulate competitor prices for this product
    comp_prices = simulate_competitor_prices(product_id, user_price, platforms, db)
    
    results = []
    day_labels = [f"Day {i}" for i in range(1, 8)]

    for comp in comp_prices:
        platform = comp["platform"]
        start_price = comp["price"] * random.uniform(0.9, 1.1)
        
        prices_for_platform = []
        current_price = start_price
        
        for day in day_labels:
            current_price = current_price * random.uniform(0.97, 1.03)
            current_price = round(current_price, 2)
            prices_for_platform.append(current_price)
            
            db_trend = PriceTrend(
                product_id=product_id,
                platform=platform,
                day_label=day,
                price=current_price
            )
            db.add(db_trend)
            
        results.append({
            "platform": platform,
            "prices": prices_for_platform,
            "day_labels": day_labels
        })
        
    db.commit()
    return results

def simulate_demand_metrics(product_id: int, db):
    avg_rating = round(random.uniform(3.8, 4.9), 1)
    total_reviews = random.randint(5000, 25000)
    monthly_growth = round(random.uniform(2.0, 15.0), 1)
    
    if monthly_growth > 10 and total_reviews > 15000:
        demand_level = "High"
    elif monthly_growth > 5 or total_reviews > 8000:
        demand_level = "Medium"
    else:
        demand_level = "Low"
        
    db.query(DemandMetric).filter(DemandMetric.product_id == product_id).delete()
    
    db_metric = DemandMetric(
        product_id=product_id,
        avg_rating=avg_rating,
        total_reviews=total_reviews,
        monthly_growth=monthly_growth,
        demand_level=demand_level
    )
    db.add(db_metric)
    db.commit()
    
    return {
        "avg_rating": avg_rating,
        "total_reviews": total_reviews,
        "monthly_growth": monthly_growth,
        "demand_level": demand_level
    }

def simulate_active_sellers() -> int:
    return random.randint(8, 45)

