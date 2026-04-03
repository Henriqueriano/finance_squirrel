import os
import jwt
import time
from datetime import timezone
from datetime import datetime
from dotenv import load_dotenv
from fastapi import Request, HTTPException


# environment setup
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

# region aux
def aux_verify_jwt(my_jwt: str) -> bool:
    date_format: str = "%Y-%m-%d %H:%M:%S"
    
    # decode and convert values of payload, this takes me a lot (rage screams) (this really got me a lot)
    payload: str = jwt.decode(my_jwt, SECRET_KEY, algorithms=["HS256"])
    expires_at = datetime.strptime(payload["expires_at"], date_format).replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc).replace(tzinfo=timezone.utc)
    user_id = payload["data"]
    
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
    jwt_token = response.headers.get("authorization").replace("Bearer", "").strip()
    if not aux_verify_jwt(jwt_token):
        raise HTTPException(
            status_code=401,
            detail=f"the user is not authenticated"
        )
    return response
# endregion

