import os
import jwt
import time
from fastapi import Request
from datetime import timezone
from datetime import datetime
from dotenv import load_dotenv
from fastapi.responses import JSONResponse


# environment setup
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_ROUTES = os.getenv('ALLOWED_ROUTES').split(',')

# region aux
def aux_verify_jwt(my_jwt: str) -> bool:
    date_format: str = "%Y-%m-%d %H:%M:%S"
    # decode and convert values of payload, this takes me a lot (rage screams) (this really got me a lot)
    payload: str = jwt.decode(my_jwt, SECRET_KEY, algorithms=["HS256"])
    expires_at = datetime.strptime(payload["expires_at"], date_format).replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc).replace(tzinfo=timezone.utc)
    user_id = payload["data"].strip()
    if (user_id != '' and (expires_at >= now)):
        return True
    
    return False # zero trust
# endregion 

# region timers middlewares
async def process_timer(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
# endregion

# region auth middleware
async def is_authenticated(request: Request, call_next):
    response = await call_next(request)
    if (request.scope['path'] in ALLOWED_ROUTES): 
        return response # first entry

    elif ('authorization' not in request.headers):
        return JSONResponse(status_code = 403,
        content = {'not allowed' : 'missing authorization header'})

    jwt_token: str = request.headers.get("authorization").replace("Bearer", "").strip()
    if aux_verify_jwt(jwt_token):
        return response

    return JSONResponse( status_code = 401,
        content = {'user_id': "the user is not authenticated"})

# endregion

