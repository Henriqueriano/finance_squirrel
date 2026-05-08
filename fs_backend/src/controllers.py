import json
from .dtos import *
from .services import *
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Request, Header

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
@expenses.post('/')
async def bulk_register(payload: ExpenseRegisterDto, request: Request) -> list[ExpenseReturnDto]:
    user_id: str = request.state.user_id
    if not user_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id cannot be empty'})

    service_response = await expenses_bulk_register_service(user_id, payload)
    if (len(service_response) == 0):
        return JSONResponse(status_code = 500, content = {'msg' : 'error while insert data'})

    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])

@expenses.get('/')
async def all_expenses(request: Request) -> list[ExpenseReturnDto]:
    user_id: str = request.state.user_id
    if not user_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id cannot be empty'})

    service_response = await get_expenses(user_id)
    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])

@expenses.patch('/{expense_id}')
async def update_expense(payload: ExpenseDto,
                         request: Request,
                         expense_id: int) -> ExpenseReturnDto:
    user_id, expense_id = request.state.user_id, expense_id
    if not user_id or not expense_id:
        return JSONResponse(status_code = 400, content = {'msg' : 'user_id or expense_id cannot be empty'})
    service_response = await update_expense_service(user_id, expense_id, payload)
    if (service_response.id == -1):
        return JSONResponse(
                status_code=500,
                content= {'msg' : 'Error while updating expense'})
    return JSONResponse(status_code = 200, content = service_response.__dict__)

@expenses.delete('/{expense_id}')
async def delete_expense(expense_id: int,
                         request: Request) -> ExpenseReturnDto:
    user_id: str = request.state.user_id
    if not expense_id or not user_id:
        return JSONResponse(
                status_code = 400,
                content = { 'msg': 'user_id or expense_id cannot be None'} )

    service_response = await delete_expense_service(user_id, expense_id)
    if (service_response.id == -1):
        return JSONResponse(
                status_code=500,
                content ={ 'msg' : 'Error while deleting'})
    return JSONResponse( status_code = 200, content = service_response.__dict__)
# endregion

# region categories:
categories = APIRouter(prefix = "/categories")
@categories.post('/')
async def categories_register(payload: CategoryDto,
                              request: Request) -> JSONResponse:
    user_id: str = request.state.user_id
    service_response = await categories_register_service(user_id, payload)
    if service_response.id == -1:
        return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while saving' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.delete('/{category_id}')
async def delete_category(category_id: int,
                          request: Request) -> JSONResponse :
    user_id: str = request.state.user_id
    if not category_id or not user_id:
            return JSONResponse( status_code = 404,
            content = {'msg' : 'missing category id or user id'})

    service_response = await delete_category_service(user_id, category_id)
    if service_response.id == -1:
        return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while deleting or category don\'t exists' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.patch('/{category_id}', response_model = None)
async def update_category(category_id: int,
                          payload: CategoryDto,
                          request: Request) -> JSONResponse:
    user_id: str = request.state.user_id
    if not user_id:
      raise JSONResponse(
                status_code = 404,
                content = { 'msg' : 'user_id cannot be None'} )
                
    service_response = await update_category_service(category_id, user_id, payload)     
    if service_response.id == -1:
         return JSONResponse( status_code = 500,
               content = { 'msg' : 'server error while updating' })

    return JSONResponse(status_code = 200, content = service_response.__dict__)

@categories.get('/', response_model = list[ExpenseCategoryReturnDto])
async def get_all_categories(request: Request) -> list[ExpenseCategoryReturnDto]:
    user_id: str = request.state.user_id
    if not user_id:
       raise JSONResponse(
                status_code = 404,
                content = { 'msg' : 'user_id cannot be None'} )

    service_response = await get_all_categories_service(user_id)
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

# region computed endpoints
computed = APIRouter(prefix = '/computed')
@computed.get('/categorical')
async def categories_expenses(request: Request) -> JSONResponse:
    user_id: str = request.state.user_id
    service_response = await categories_expenses_service(user_id)
    return JSONResponse(status_code = 200, content = [data.__dict__ for data in service_response])

@computed.get('/balance')
async def total_expenses(request: Request) -> dict:
    user_id: str = request.state.user_id
    service_response = await total_balance_service(user_id)
    return JSONResponse(status_code = 200, content = service_response)
# endregion
