from fastapi import APIRouter, HTTPException, status
from .dtos import *
from .services import *
router = APIRouter()

## expenses section: 
@router.post('/persist_expenses/')
async def persist_expenses(payload: list[ExpenseDto]) -> None:
    if payload == None:
        raise HTTPException(
                status_code=400,
                detail='payload cannot be None')
    service_response = await persist_expenses_service(payload)
    print(service_response)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

