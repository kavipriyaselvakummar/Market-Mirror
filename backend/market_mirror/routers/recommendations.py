from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/get_ai_recommendation/{product_id}", response_model=schemas.AIRecommendationResponse)
def get_ai_recommendation(product_id: int, db: Session = Depends(get_db)):
    result = crud.calculate_ai_recommendation(db, product_id)
    if not result:
        raise HTTPException(status_code=404, detail="Could not calculate recommendation")
    return result

