from .dtos import *
from .services import *
from fastapi import APIRouter, HTTPException, status
router = APIRouter()

# region expenses: 
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
# end region

# region categories:
@router.post('/categories_register/')
async def categories_register(payload: ExpensesCategoryDto) -> None:
    if payload == None:
        raise HTTPException(
                status_code=400,
                detail='payload cannot be None')
    service_response = await categories_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.patch('/update_category/')
async def update_category(category_id: str, payload: ExpenseCategoryModel) -> None:
    if payload is None:
        raise HTTPException(
                status_code=400,
                detail='category_id cannot be None')
    service_response = await update_category_service(category_id, payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.get('/get_all_categories/')
async def get_all_categories(user_id: str) -> list[ExpensesCategoryDto]:
    if user_id is None or user_id == '':
        raise HTTPException(
                status_code=400,
                detail='user_id cannot be None')
    service_response = await get_all_categories(user_id)
    if (len(service_response) == 0):
        raise HTTPException(
                status_code=500,
                detail='nothing on the base')

# endregion

# region user:
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
# endregion
   
