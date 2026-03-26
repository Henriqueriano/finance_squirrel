from .dtos import *
from .services import *
from fastapi import APIRouter, HTTPException, status
router = APIRouter()

# region expenses: 
@router.post('/expenses_bulk_register/')
async def expenses_bulk_register(payload: list[ExpensesDto]) -> None:
    service_response = await expenses_bulk_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.get('/get_expenses/', response_model = list[ExpensesDto])
async def get_expenses(user_id: str) -> list[Expenses]:
    if user_id == '':
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
    if expense_id == '':
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
@router.delete('/delete_category/')
async def delete_category(payload: int) -> None:
    service_response = await delete_category_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')


@router.post('/categories_register/')
async def categories_register(payload: ExpensesCategoryDto) -> None:
    service_response = await categories_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.patch('/update_category/', response_model = None)
async def update_category(category_id: str, payload: ExpensesCategoryDto) -> None:
    service_response = await update_category_service(category_id, payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@router.get('/get_all_categories/', response_model = list[ExpensesCategoryReturnDto])
async def get_all_categories(user_id: str) -> list[ExpensesCategoryReturnDto]:
    if user_id == '':
        raise HTTPException(
                status_code=400,
                detail='user_id cannot be None')
    service_response = await get_all_categories_service(user_id)
    if (len(service_response) == 0):
        raise HTTPException(
                status_code=500,
                detail='nothing on the base')
    return service_response
# endregion

# region user:
@router.post('/register_user/')
async def register_user(payload: UserDto) -> None:
    service_response = await user_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')
# endregion
   
