from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/trends", tags=["trends"])

@router.get("/get_trends/{product_id}", response_model=List[schemas.TrendResponse])
def get_trends(product_id: int, db: Session = Depends(get_db)):
    trends_data = crud.get_price_trends(db, product_id)
    if not trends_data:
        raise HTTPException(status_code=404, detail="Trend data not found")
    
    responses = []
    for platform, data in trends_data.items():
        first_price = data["prices"][0]
        last_price = data["prices"][-1]
        price_change = round(last_price - first_price, 2)
        
        if price_change > 0:
            trend = "Increasing"
            reason = "High market demand detected"
        elif price_change < 0:
            trend = "Decreasing"
            reason = "Flash sale or stock clearance likely"
        else:
            trend = "Stable"
            reason = "Market prices holding steady"
            
        responses.append({
            "platform": platform,
            "prices": data["prices"],
            "day_labels": data["day_labels"],
            "price_change": price_change,
            "trend": trend,
            "possible_reason": reason
        })
    return responses

