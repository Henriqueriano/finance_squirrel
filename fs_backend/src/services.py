import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, select, update, delete
from sqlalchemy.orm import sessionmaker, Session
from .dtos import *
from .models import *

# environment setup
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

# expenses region
async def expenses_bulk_register_service(payload: list[ExpensesDto]) -> bool: 
    data: list[ExpenseModel] = [ExpenseModel(
        user_id = e.user_id,
        expense_value = e.expense_value,
        expense_date = e.expense_date,
        category_id = e.category_id,
        expense_desc = e.expense_desc) for e in payload]
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
       with session() as session: 
            session.add_all(data)
            session.commit()
            return True
    except Exception as e:
        print('ERROR: ', e)
        return False

async def get_expenses(user_id: str) -> list[ExpensesDto]:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = select(ExpensesModel).where(Expenses.user_id == user_id)
        with session() as session:
            db_data = session.scalars(statement).all()
            data: list[ExpensesDto] = [ExpensesDto(
                user_id = d.user_id,
                expense_value = d.expense_value,
                expense_date = d.expense_date,
                category_id = d.category_id,
                expense_desc = d.expense_desc) for d in db_data]
            return data
    except e:
        print('Error: ', e)
        return data

async def update_expense_service(expense_id: str, payload: ExpensesDto) -> bool:
    statement = update(ExpenseModel).values(payload).where(ExpenseModel.expense_id == expense_id)
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try: 
        with session() as session:
            session.execute(statement)
            session.commit()
            return True
    except Exception as e:
       print('ERROR: ', e)
       return False

async def delete_expense_service(expense_id: int) -> bool:
    statement = delete(ExpenseModel).where(ExpenseModel.expense_id == expense_id)
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try: 
       with session() as session:
          session.execute(statement)
          session.commit()
          return True
    except Exception as e:
       print('ERROR: ', e)
       return False

       

# categoryes region
async def categoryes_bulk_register_service(payload: list[ExpensesCategoryDto]) -> bool:
    data: list[ExpenseCategoryModel] = [ExpenseCategoryModel(
        category_name = e.category_name,
        user_id = e.user_id) for e in payload]
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
       with session() as session: 
            session.add_all(data)
            session.commit()
            return True
    except Exception as e:
        print('ERROR: ', e)
        return False


# user region
async def user_register_service(payload: UserDto) -> bool:
    data: UserModel = UserModel(user_name = payload.user_name)
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
       with session() as session: 
            session.add(data)
            session.commit()
            return True
    except Exception as e:
        print('ERROR: ', e)
        return False

