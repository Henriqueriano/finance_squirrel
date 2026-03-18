from fastapi import FastAPI
from src import controllers
app = FastAPI()
app.include_router(controllers.router, prefix='/api/v1', tags=['controllers'])
