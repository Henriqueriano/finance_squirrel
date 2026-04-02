import logging
from fastapi import FastAPI
from src import controllers
from fastapi.middleware.cors import CORSMiddleware

level = logging.INFO
file_name = "log_file.log"
log_format = "[%(asctime)s - %(levelname)s] : %(message)s"

logging.basicConfig(level = level,
                    filename = file_name,
                    filemode = 'w',
                    format = log_format)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(controllers.auth, tags=['auth'])
app.include_router(controllers.expenses, tags=['expenses'])
app.include_router(controllers.categories, tags=['categories'])
app.include_router(controllers.users, tags=['users'])


