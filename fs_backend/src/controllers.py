from fastapi import APIRouter, HTTPException, status
from .dtos import *
from .services import *
router = APIRouter()

## expenses section: 
@router.post('/expenses_bulk_register/')
async def expenses_bulk_register(payload: list[ExpensesDto]) -> None:
    if payload == None:
        raise HTTPException(
                status_code=400,
                detail='payload cannot be None')
    service_response = await expenses_bulk_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.get('/get_expenses/', response_model = list[ExpensesDto])
async def get_expenses(user_id: str) -> list[Expenses]:
    if user_id is None or user_id == '':
        raise HTTPException(
                status_code=400,
                detail='user_id cannot be None')
    service_response = await get_expenses_service(payload)
    if (len(service_response) == 0):
        raise HTTPException(
                status_code=500,
                detail='nothing on the base')

@router.patch('/update_expense/')
async def update_expense(expense_id: int, payload: ExpensesDto) -> None:
    if payload is None:
        raise HTTPException(
                status_code=400,
                detail='expense_id cannot be None')
    service_response = await update_expense_service(expense_id, payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.delete('/delete_expense/')
async def delete_expense(expense_id: int) -> None:
    if expense_id is None:
        raise HTTPException(
                status_code=400,
                detail='expense_id cannot be None')
    service_response = await delete_expense_service(expense_id)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')


## categoryes section:
@router.post('/categoryes_bulk_register/')
async def categoryes_bulk_register(payload: list[ExpensesCategoryDto]) -> None:
    if payload == None:
        raise HTTPException(
                status_code=400,
                detail='payload cannot be None')
    service_response = await categoryes_bulk_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

## user section:
@router.post('/register_user/')
async def register_user(payload: UserDto) -> None:
    if payload == None:
        raise HTTPException(
                status_code=400,
                detail='payload cannot be None')
    service_response = await user_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')
    
# GET USER
@router.get('/get_user/', response_model=UserDto)
async def get_user(user_id: str):
    if not user_id:
        raise HTTPException(status_code=400, detail='user_id is required')

    user = await get_user_service(user_id)

    if not user:
        raise HTTPException(status_code=404, detail='user not found')

    return user


# UPDATE USER
@router.patch('/update_user/')
async def update_user(user_id: str, payload: UserDto):
    if not user_id or not payload:
        raise HTTPException(status_code=400, detail='invalid data')

    success = await update_user_service(user_id, payload)

    if not success:
        raise HTTPException(status_code=500, detail='server error')


# DELETE USER
@router.delete('/delete_user/')
async def delete_user(user_id: str):
    if not user_id:
        raise HTTPException(status_code=400, detail='user_id required')

    success = await delete_user_service(user_id)

    if not success:
        raise HTTPException(status_code=500, detail='server error')

   
