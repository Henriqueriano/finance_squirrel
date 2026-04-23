import json
from .dtos import *
from .services import *
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Header

# region auth
auth = APIRouter(prefix = "/auth")
@auth.post('/login/')
async def login(payload: LoginDto) -> AuthReturnDto:
    service_response = await login_service(payload)
    if not service_response.id:
        return JSONResponse(status_code = 404,
               content = {'msg' : "user or password's incorrect"})
    headers = {'Authorization':f'Bearer {service_response.auth}'}
    return JSONResponse( status_code = 200,
            content = service_response.__dict__,
            headers = headers)

@auth.post('/register/')
async def register(payload: RegisterDto) -> str:
    if await user_exists_service(payload.user_login):
        return JSONResponse( status_code = 409,
                content = {'msg' : 'user already exists'})
    service_response = await register_service(payload)
    headers = {'Authorization':f'Bearer {service_response.auth}'}
    return JSONResponse( status_code = 200,
                        content = service_response.__dict__,
                        headers = headers)
# endregion

# region expenses: 
expenses = APIRouter(prefix = "/expenses")
@expenses.post('/register/')
async def bulk_register(payload: ExpenseRegisterDto) -> list[ExpenseReturnDto]:
    user_id: str = payload.user_id
    if not user_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id cannot be empty'})

    service_response = await expenses_bulk_register_service(user_id, payload)
    if (len(service_response) == 0):
        return JSONResponse(status_code = 500, content = {'msg' : 'error while insert data'})
    print()
    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])

@expenses.get('/all/')
async def all_expenses(user_id: str) -> list[ExpenseReturnDto]:
    if not user_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id cannot be empty'})

    service_response = await get_expenses(user_id)
    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])

@expenses.patch('/update/')
async def update_expense(payload: ExpenseUpdateDto) -> ExpenseReturnDto:
    user_id, expense_id = payload.user_id, payload.expense_id
    if not user_id or not expense_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id or expense_id cannot be empty'})

    service_response = await update_expense_service(user_id, expense_id, payload.expense)
    if (service_response.expense_id == -1):
        return JSONResponse(
                status_code=500,
                content= {'msg' : 'Error while updating expense'})
    return JSONResponse(status_code = 200, content = service_response.__dict__)

@expenses.delete('/delete/')
async def delete_expense(user_id: str, expense_id: int) -> ExpenseReturnDto:
    if not expense_id or not user_id:
        return JSONResponse(
                status_code = 400,
                content = { 'msg': 'user_id or expense_id cannot be None'} )

    service_response = await delete_expense_service(user_id, expense_id)
    if (service_response.expense_id == -1):
        return JSONResponse(
                status_code=500,
                content ='Error while deleting')
    return JSONResponse( status_code = 200, content = service_response.__dict__)
# endregion

# region categories:
categories = APIRouter(prefix = "/categories")
@categories.post('/register/')
async def categories_register(payload: ExpenseCategoryDto) -> JSONResponse:
    service_response = await categories_register_service(payload.user_id, payload.category)
    if service_response.category_id == -1:
        return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while saving' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.delete('/delete/')
async def delete_category(category_id : int, user_id: str) -> JSONResponse :
    if not category_id or not user_id:
            return JSONResponse( status_code = 404,
            content = {'msg' : 'missing category id or user id'})

    service_response = await delete_category_service(user_id, category_id)
    if service_response.category_id == -1:
        return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while deleting or category don\'t exists' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.patch('/update/', response_model = None)
async def update_category(payload: ExpenseCategoryUpdateDto) -> JSONResponse:
    if not payload.user_id:
      raise JSONResponse(
                status_code = 404,
                content = { 'msg' : 'user_id cannot be None'} )
                
    service_response = await update_category_service(payload)     
    if service_response.category_id == -1:
         return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while updating' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.get('/all/', response_model = list[ExpenseCategoryReturnDto])
async def get_all_categories(user_id: str) -> list[ExpenseCategoryReturnDto]:
    if not user_id:
       raise JSONResponse(
                status_code = 404,
                content = { 'msg' : 'user_id cannot be None'} )

    service_response = await get_all_categories_service(user_id)
    if service_response[0].category_id == -1:
        return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while getting data' })
            
    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])
# endregion

# region user:
    # recreate
# endregion

# region user settings
settings = APIRouter(prefix = "/settings")
@settings.post("/create/")
async def create_config(x_request_id: UserSettingDto):
    # success = await delete_user_service(x_request_id)
    if not True:
        raise HTTPException(status_code=500, detail='server error')

@settings.get('/get/')
async def get_setting(x_request_id: str = Header('X-request-id')) -> UserSettingDto:
    service_response = await get_settings_service(x_request_id)
    if service_response == None:
        raise HTTPException(status_code=500,
                         detail='server error')
    return service_response
# endregion
