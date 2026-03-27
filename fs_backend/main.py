from fastapi import FastAPI
from src import controllers
import logging

level = logging.INFO
file_name = "log_file.log"
log_format = "[%(asctime)s - %(levelname)s] : %(message)s"

logging.basicConfig(level = level,
                    filename = file_name,
                    filemode = 'w',
                    format = log_format)
app = FastAPI()
app.include_router(controllers.router, prefix='/api/v1', tags=['controllers'])
