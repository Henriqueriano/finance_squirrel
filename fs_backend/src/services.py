import os
import jwt
import bcrypt
from .dtos import *
from .models import *
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select, update, delete

# environment setup
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

# region auth
def aux_create_user(user_name):
    data: UserModel = UserModel(
        user_name = user_name,
        is_active = 1
    )
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(engine)
        with Session() as session:
            entry = session.add(data)
            session.commit()
            return entry.user_id
    except:
        return ''

async def login_service(payload: LoginDto):
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            db = session.select(LoginModel).where(
                LoginModel.user_login == payload.user_login).first()
            if len(db) == 0:
                return ''
            passw: str = db[3]
            if bcrypt.checkpw(payload.user_password.encode('utf-8'), passw):
                return jwt.encode(
                    {'user_id' : db[1]},
                    SECRET_KEY, algorithm="HS256")
    except:
        return ''
    
async def register_service(payload: RegisterDto):
    passw: str = payload.user_login.user_pass.encode('utf-8')  
    user_id = aux_create_user(payload.user_name),
    data: LoginModel = LoginModel(
        user_id = user_id,
        user_login = payload.user_login.user_login,
        user_pass = bcrypt.hashpw(passw,
                    bcrypt.gensalt(rounds=16))
    )
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            session.add(data)
            session.commit()
            return jwt.encode({'user_id' : user_id}, 
                              SECRET_KEY, algorithm="HS256")
    except:
        return ''
# endregion

# region expenses
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
    data: ExpenseModel = ExpenseModel(
        user_id = payload.user_id,
        expense_value = payload.expense_value,
        expense_date = payload.expense_date,
        category_id = payload.category_id,
        expense_desc = payload.expense_desc
    ) 
    statement = update(ExpenseModel).values(data).where(ExpenseModel.expense_id == expense_id)
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
# endregion

       

# region categoryes 
async def categories_register_service(payload: ExpensesCategoryDto) -> bool:
    data: ExpenseCategoryModel = ExpenseCategoryModel(
        category_name = payload.category_name,
        user_id = payload.user_id) 
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

async def update_category_service(category_id: str, payload: ExpensesCategoryDto) -> str:
    data: ExpenseCategoryModel = ExpenseCategoryModel(
        category_name = payload.category_name,
        user_id = payload.user_id)
    statement = update(ExpenseCategoryModel).values(
        category_name = payload.category_name).where(
        ExpenseCategoryModel.category_id == category_id)
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

async def delete_category_service(category_id: int) -> bool:
    statement = delete(ExpenseCategoryModel).where(ExpenseCategoryModel.category_id == category_id)
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

async def get_all_categories_service(user_id: str) -> list[ExpensesCategoryReturnDto]:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = select(ExpenseCategoryModel).where(ExpenseCategoryModel.user_id == user_id)
        with session() as session:
            db_data = session.scalars(statement).all()
            data: list[ExpensesCategoryReturnDto] = [ExpensesCategoryReturnDto(
                category_id = d.category_id,
                category_name = d.category_name) for d in db_data]
            return data
    except e:
        print('Error: ', e)
        return data
# endregion


# region user 
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

async def get_user_service(user_id: str) -> UserDto | None:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = select(UserModel).where(UserModel.user_id == user_id)
        with session() as session:
            user = session.scalar(statement)
            if not user:
                return None
            return UserDto(user_name=user.user_name)
    except Exception as e:
        print('ERROR:', e)
        return None

async def update_user_service(user_id: str, payload: UserDto) -> bool:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = (
            update(UserModel)
            .where(UserModel.user_id == user_id)
            .values(user_name=payload.user_name)
        )
        with session() as session:
            session.execute(statement)
            session.commit()
            return True
    except Exception as e:
        print('ERROR:', e)
        return False

async def delete_user_service(user_id: str) -> bool:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = delete(UserModel).where(UserModel.user_id == user_id)
        with session() as session:
            session.execute(statement)
            session.commit()
            return True
    except Exception as e:
        print('ERROR:', e)
        return False        
# endregion