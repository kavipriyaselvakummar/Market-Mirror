from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/query", tags=["query"])

@router.post("/query_market", response_model=schemas.QueryResponse)
def query_market(request: schemas.QueryRequest, db: Session = Depends(get_db)):
    product_id = request.product_id
    question = request.question.lower()
    
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    prices = crud.get_competitor_prices(db, product_id)
    metrics = crud.get_demand_metrics(db, product_id)
    trends = crud.get_price_trends(db, product_id)
    
    answer = "Try asking about prices, demand, trends, or recommendations."
    
    if "lowest" in question:
        if prices:
            min_p = min(prices, key=lambda x: x.price)
            answer = f"The lowest competitor price is ₹{min_p.price} on {min_p.platform}."
    elif "highest" in question:
        if prices:
            max_p = max(prices, key=lambda x: x.price)
            answer = f"The highest competitor price is ₹{max_p.price} on {max_p.platform}."
    elif "demand" in question:
        if metrics:
            answer = f"Current demand is {metrics.demand_level} with {metrics.monthly_growth}% monthly growth."
    elif "recommend" in question or "suggest" in question:
        rec = crud.calculate_ai_recommendation(db, product_id)
        if rec:
            answer = f"I suggest setting your price to ₹{rec['suggested_price']}. {rec['reason']}"
    elif "risk" in question or "competition" in question:
        risk = crud.calculate_risk(db, product_id)
        if risk:
            answer = f"Competition level is {risk['competition_level']} with {risk['active_sellers']} active sellers tracked."
    elif "trend" in question:
        if trends:
            # Pick the first platform as example or summarize
            platform = list(trends.keys())[0]
            data = trends[platform]
            diff = data["prices"][-1] - data["prices"][0]
            dir = "upward" if diff > 0 else "downward" if diff < 0 else "stable"
            answer = f"The price trend for {platform} is {dir}."
    else:
        # Check for specific platform names in question
        for platform in trends.keys():
            if platform.lower() in question:
                data = trends[platform]
                diff = data["prices"][-1] - data["prices"][0]
                dir = "increasing" if diff > 0 else "decreasing" if diff < 0 else "stable"
                answer = f"Prices on {platform} are currently {dir}."
                break

    return {"answer": answer}

