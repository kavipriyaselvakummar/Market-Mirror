from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/get_alerts/{product_id}", response_model=List[schemas.AlertResponse])
def get_alerts(product_id: int, db: Session = Depends(get_db)):
    return crud.calculate_alerts(db, product_id)

