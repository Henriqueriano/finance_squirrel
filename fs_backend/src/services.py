import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .dtos import *
from .models import *

# environment setup
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

async def persist_expenses_service(payload: list[ExpenseDto]) -> bool: 
    data: list[Expenses] = [Expenses(
        user_id = e.user_id,
        expense_value = e.expense_value,
        expense_date = e.expense_date,
        expense_category = e.expense_category,
        expense_desc = e.expense_desc) for e in payload]

    try:
       engine = create_engine(DATABASE_URL)
       session = sessionmaker(bind=engine)
       with session() as session: 
            session.add_all(data)
            session.commit()
            return True
    except Exception as e:
        print('ERROR: ', e)
        return False
