from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/prices", tags=["prices"])

@router.get("/get_prices/{product_id}", response_model=List[schemas.CompetitorPriceResponse])
def get_prices(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    prices = crud.get_competitor_prices(db, product_id)
    responses = []
    for p in prices:
        diff = p.price - product.your_price
        status = "Higher" if diff > 0 else "Cheaper" if diff < 0 else "Same"
        responses.append({
            "platform": p.platform,
            "price": p.price,
            "difference": round(diff, 2),
            "status": status
        })
    return responses

@router.post("/refresh_prices/{product_id}")
def refresh_prices(product_id: int, db: Session = Depends(get_db)):
    result = crud.refresh_all_data(db, product_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    # Return updated price list as requested
    product = crud.get_product(db, product_id)
    prices = crud.get_competitor_prices(db, product_id)
    responses = []
    for p in prices:
        diff = p.price - product.your_price
        status = "Higher" if diff > 0 else "Cheaper" if diff < 0 else "Same"
        responses.append({
            "platform": p.platform,
            "price": p.price,
            "difference": round(diff, 2),
            "status": status
        })
    return responses

