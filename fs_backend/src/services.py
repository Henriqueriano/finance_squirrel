import os
import jwt
import bcrypt
import datetime
from .dtos import *
from .models import *
from datetime import timedelta
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select, update, delete

# environment setup
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

# region aux methods
def aux_create_user(user_name) -> str:
    data: UserModel = UserModel(
        user_name = user_name,
        is_active = 1
    )
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(engine)
        with Session() as session:
            session.add(data)
            session.flush()
            session.commit()
            return data.user_id
    except:
        return ''
    
def aux_create_jwt(payload: str) -> str:
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes = 30)
    data: object = { 'data': payload, 'expires_at': expiration_time.strftime("%Y-%m-%d %H:%M:%S")}
    return jwt.encode( data, SECRET_KEY, algorithm="HS256")
# endregion

# region auth
async def get_user_id_service(user_login: str):
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            db = session.query(LoginModel).where(
                LoginModel.user_login == user_login).first()
            if db.user_id != '':
                return db.user_id
            return ''
    except Exception as e:
        print(e.__cause__)
        return ''

async def login_service(payload: LoginDto) -> str:
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            db = session.query(LoginModel).where(
            LoginModel.user_login == payload.user_login).first()
            if db.user_id == '':
                return ''
            passw: str = db.user_password.encode('utf-8')
            if bcrypt.checkpw(payload.user_password.encode('utf-8'), passw):
                return aux_create_jwt(str(db.user_id))
    except Exception as e:
        return ''
    
async def register_service(payload: RegisterDto) -> str:
    passw: str = payload.user_password.encode('utf-8')  
    user_id = aux_create_user(payload.user_name)
    decoded_bpass =  bcrypt.hashpw(passw , bcrypt.gensalt(rounds=16)
                    ).decode('utf-8') # https://stackoverflow.com/questions/34548846/flask-bcrypt-valueerror-invalid-salt
    data: LoginModel = LoginModel(
        user_id = user_id,
        user_login = payload.user_login,
        user_password = decoded_bpass
    )
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            session.add(data)
            session.commit()
            return aux_create_jwt(str(user_id))
    except Exception as e:
        print(e)
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
        statement = select(ExpenseModel).where(ExpenseModel.user_id == user_id)
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
async def categories_register_service(payload: ExpensesCategoryDto, user_id: str) -> bool:
    data: ExpenseCategoryModel = ExpenseCategoryModel(
        category_name = payload.category_name,
        category_color = payload.category_color,
        user_id = user_id) 
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

async def update_category_service(category_id: str, x_request_id: str, payload: ExpensesCategoryDto) -> str:
    data: ExpenseCategoryModel = ExpenseCategoryModel(
        category_name = payload.category_name,
        user_id = x_request_id)
    statement = update(ExpenseCategoryModel).values(
        category_name = payload.category_name,
        category_color = payload.category_color).where(
        ExpenseCategoryModel.category_id == category_id 
        and ExpenseCategoryModel.user_id == x_request_id)
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

async def delete_category_service(category_id: int, x_request_id: str) -> bool:
    statement = delete(ExpenseCategoryModel).where(ExpenseCategoryModel.category_id == category_id 
                                                   and ExpenseCategoryModel.user_id == x_request_id)
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
                category_name = d.category_name,
                category_color = d.category_color) for d in db_data]
            return data
    except:
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

# region user settings 
async def get_settings_service(payload: UserSettingDto, user_id: str) -> UserSettingDto:
    sttm = select(UserSettingModel).where(UserSettingModel.user_id == user_id)
    try: 
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            data = session.execute(sttm)
            print(data)
    except:
        return ''