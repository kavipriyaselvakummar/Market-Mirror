from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/risk", tags=["risk"])

@router.get("/get_risk/{product_id}", response_model=schemas.RiskResponse)
def get_risk(product_id: int, db: Session = Depends(get_db)):
    result = crud.calculate_risk(db, product_id)
    if not result:
        raise HTTPException(status_code=404, detail="Risk calculation failed")
    return result

