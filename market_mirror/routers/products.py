from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/add_product", response_model=schemas.ProductResponse)
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = crud.create_product(db, product)
    return {
        "id": db_product.id,
        "product_name": db_product.product_name,
        "your_platform": db_product.your_platform,
        "your_price": db_product.your_price,
        "min_margin": db_product.min_margin,
        "competitor_platforms": db_product.competitor_platforms.split(",") if db_product.competitor_platforms else [],
        "created_at": db_product.created_at
    }

@router.get("/get_product/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Handle list conversion for response if needed (orm_mode handles it if it was a property,
    # but since it's a comma-separated string in DB, we might need to split it if the schema expects list[str])
    # ProductResponse schema has competitor_platforms: list[str]
    # We can add a getter/setter or just handle it here.
    
    # If the ORM model says String but Schema says List[str], Pydantic won't auto-split.
    # Let's adjust the object for the response:
    platforms = db_product.competitor_platforms.split(",") if db_product.competitor_platforms else []
    
    return {
        "id": db_product.id,
        "product_name": db_product.product_name,
        "your_platform": db_product.your_platform,
        "your_price": db_product.your_price,
        "min_margin": db_product.min_margin,
        "competitor_platforms": platforms,
        "created_at": db_product.created_at
    }

