from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/demand", tags=["demand"])

@router.get("/get_demand_metrics/{product_id}", response_model=schemas.DemandMetricsResponse)
def get_demand_metrics(product_id: int, db: Session = Depends(get_db)):
    metrics = crud.get_demand_metrics(db, product_id)
    if not metrics:
        raise HTTPException(status_code=404, detail="Demand metrics not found")
    
    summary = f"Current demand level is {metrics.demand_level}. "
    summary += f"The product has an average rating of {metrics.avg_rating} from {metrics.total_reviews} reviews, "
    summary += f"with a monthly growth rate of {metrics.monthly_growth}%."
    
    return {
        "avg_rating": metrics.avg_rating,
        "total_reviews": metrics.total_reviews,
        "monthly_growth": metrics.monthly_growth,
        "demand_level": metrics.demand_level,
        "summary": summary
    }

