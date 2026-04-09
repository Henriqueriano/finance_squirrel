from .dtos import *
from .services import *
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException, Header

# region auth
auth = APIRouter(prefix = "/auth")
@auth.post('/login/')
async def login(payload: LoginDto) -> str:
    if (payload.user_login == '' 
        or payload.user_password == ''):
        raise HTTPException(status_code = 404,
                            detail = "login or pass cannot be empty" )
    service_response = await login_service(payload)
    user_id = await get_user_id_service(payload.user_login)
    if (service_response == '' or user_id == ''):
        raise HTTPException(
                status_code=500,
                detail='server error')
    headers: object = { 'Authorization' : f'Bearer {service_response}', 'X-request-id' : str(user_id) }
    return JSONResponse(status_code = 200, headers = headers, content = 'logged')

@auth.post('/register/')
async def register(payload: RegisterDto) -> str:
    if (payload.user_name == '' 
        or payload.user_login == '' 
        or payload.user_password == ''):
        raise HTTPException(status_code = 404,
                    detail = "name, login or pass cannot be empty" )
    service_response = await register_service(payload)
    user_id = await get_user_id_service(payload.user_login) # confirmed insertion
    print(service_response)
    print(user_id) 
    if (service_response == '' or user_id == ''):
        raise HTTPException(
            status_code=500,
            detail='server error')
    headers: object = { 'Authorization' : f'Bearer {service_response}', 'X-request-id' : str(user_id) }
    return JSONResponse(status_code = 200, headers = headers, content = 'registered')
# endregion

# region expenses: 
expenses = APIRouter(prefix = "/expenses")
@expenses.post('/register/')
async def bulk_register(payload: list[ExpensesDto]) -> None:
    service_response = await expenses_bulk_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@expenses.get('/all/', response_model = list[ExpensesDto])
async def all_expenses(payload : str = Header('X-request-id')) -> list[ExpensesDto]:
    if payload == '':
        raise HTTPException(
                status_code=400,
                detail='user_id cannot be None')
    service_response = await get_expenses(payload)
    if (len(service_response) == 0):
        raise HTTPException(
                status_code=500,
                detail='nothing on the base')

@expenses.patch('/update/')
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

@expenses.delete('/delete/')
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
# endregion

# region categories:
categories = APIRouter(prefix = "/categories")
@categories.delete('/delete/')
async def delete_category(category_id: int, x_request_id = Header(None)) -> None:
    if category_id == '' and x_request_id == '':
        raise HTTPException(
                status_code=404,
                detail='missed things')
    service_response = await delete_category_service(category_id, x_request_id)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@categories.post('/register/')
async def categories_register(payload: ExpensesCategoryDto, x_request_id = Header(None)) -> None:
    service_response = await categories_register_service(payload, x_request_id)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@categories.patch('/update/', response_model = None)
async def update_category(category_id: str, payload: ExpensesCategoryDto, x_request_id = Header(None)) -> None:
    service_response = await update_category_service(category_id, x_request_id, payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')

@categories.get('/all/', response_model = list[ExpensesCategoryReturnDto])
async def get_all_categories(x_request_id = Header(None)) -> list[ExpensesCategoryReturnDto]:
    if x_request_id == '':
        raise HTTPException(
                status_code=400,
                detail='request id cannot be None')
    service_response = await get_all_categories_service(x_request_id)
    if (len(service_response) == 0):
        raise HTTPException(
                status_code=500,
                detail='nothing on the base')
    return service_response
# endregion

# region user:
users = APIRouter(prefix = "/users")
@users.post('/register/')
async def register_user(payload: UserDto) -> None:
    service_response = await user_register_service(payload)
    if (not service_response):
        raise HTTPException(
                status_code=500,
                detail='server error')
    
@users.get('/get/', response_model = UserDto)
async def get_user(user_id: str) -> str:
    if not user_id:
        raise HTTPException(status_code=400, detail='user_id is required')
    user = await get_user_service(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='user not found')
    return user

@users.patch('/update/')
async def update_user(payload: UserDto) -> None:
    success = await update_user_service(payload)
    if not success:
        raise HTTPException(status_code=500, detail='server error')

@users.delete('/delete/')
async def delete_user(payload: str) -> None:
    if not payload:
        raise HTTPException(status_code=400, detail='user_id required')
    success = await delete_user_service(payload)
    if not success:
        raise HTTPException(status_code=500, detail='server error')
# endregion

# region user settings
settings = APIRouter(prefix = "/settings")
@settings.post("/create/")
async def create_config(payload: UserSettingDto):
    success = await delete_user_service(payload)
    if not success:
        raise HTTPException(status_code=500, detail='server error')

@settings.get('/get/')
async def get_setting(payload: str = Header('X-request-id')) -> UserSettingDto:
    service_response = await get_settings_service(payload)
    if service_response == None:
        raise HTTPException(status_code=500,
                         detail='server error')
    return payload
# endregion
