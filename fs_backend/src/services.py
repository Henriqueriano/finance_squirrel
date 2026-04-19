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
            is_active = 1)
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(engine)
        with Session() as session:
            session.add(data)
            session.flush()
            session.commit()
            return data.user_id
    except Exception as e:
        raise Exception(f'Aux create user error > {e}')

def aux_create_jwt(payload: str) -> str:
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes = 30)
    data: object = { 'data': payload,
                    'expires_at': expiration_time.strftime("%Y-%m-%d %H:%M:%S")}
    return jwt.encode( data, SECRET_KEY, algorithm="HS256")

# endregion

# region auth

async def user_exists_service(user_login: str) -> bool:
    query = select(LoginModel).where(LoginModel.user_login == user_login)
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            data = session.execute(query).first()
            if data == None:
                return False
            return True
    except Exception as e:
        raise Exception(f'Error in user exists service > {e}')


async def login_service(payload: LoginDteo) -> AuthReturnDto:
    data: AuthReturnDto = AuthReturnDto(id = '', name = '', auth = '')
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        query = select(LoginModel, UserModel).join(UserModel,
                                                   LoginModel.user_id == UserModel.user_id).where(
                                                           LoginModel.user_login == payload.user_login)

        with Session() as session:
            lm, um = session.execute(query).first()
            passw: str = lm.user_password.encode('utf-8')
            if bcrypt.checkpw(payload.user_password.encode('utf-8'), passw):
                data.id = str(lm.user_id)
                data.name = um.user_name
                data.auth = aux_create_jwt(str(lm.user_id))
            return data

    except Exception as e:
        raise Exception(f'Login service exception > {e}') 

async def register_service(payload: RegisterDto) -> AuthReturnDto:
    backdata: AuthReturnDto = AuthReturnDto(id = '', name = '', auth = '')
    try:
        encoded_pass = (payload.user_password + SECRET_KEY).encode('utf-8')
        data: LoginModel = LoginModel(
                user_id = aux_create_user(payload.user_name),
                user_login = payload.user_login,
                user_password = bcrypt.hashpw(encoded_pass, bcrypt.gensalt(rounds = 4))
                )
        engine = create_engine(DATABASE_URL) 
        Session = sessionmaker(bind = engine)
        with Session() as session:
            session.add(data)
            session.flush()
            session.commit()

            # setup return
            backdata.id = str(data.user_id)
            backdata.name = payload.user_name
            backdata.auth = aux_create_jwt(str(data.user_id))

            return backdata
    except Exception as e:
        raise Exception(f'Register service error > {e}')

# endregion

# region expenses
async def expenses_bulk_register_service(payload: list[ExpenseDto], x_request_id) -> bool: 
    data: list[ExpenseModel] = [ExpenseModel(
        user_id = x_request_id,
        expense_value = e.expense_value,
        expense_date = e.expense_date,
        expense_type = e.expense_type,
        category_id = e.category_id,
        expense_desc = e.expense_desc) for e in payload]
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        with session() as session: 
            session.add_all(data)
            session.commit()
            return True
    except:
        return False

async def get_expenses(user_id: str) -> list[ExpenseReturnDto]:
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try:
        statement = select(ExpenseModel).where(ExpenseModel.user_id == user_id)
        with session() as session:
            db_data = session.scalars(statement).all()
            data: list[ExpenseReturnDto] = [ExpenseReturnDto(
                expense_id = d.expense_id,
                expense_value = d.expense_value,
                expense_date = d.expense_date,
                expense_type = d.expense_type,
                category_id = d.category_id,
                expense_desc = d.expense_desc) for d in db_data]
            return data
    except:
        return []

async def update_expense_service(expense_id: str, x_request_id: str, payload: ExpenseDto) -> bool:
    statement = update(ExpenseModel).values(
            expense_value = payload.expense_value,
            expense_date = payload.expense_date,
            expense_type = payload.expense_type,
            category_id = payload.category_id,
            expense_desc = payload.expense_desc).where(ExpenseModel.expense_id == expense_id 
                                                       and ExpenseModel.user_id == x_request_id)
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try: 
        with session() as session:
            session.execute(statement)
            session.commit()
            return True
    except:
        return False

async def delete_expense_service(expense_id: int, x_request_id: str) -> bool:
    statement = delete(ExpenseModel).where(
            ExpenseModel.expense_id == expense_id,
            ExpenseModel.user_id == x_request_id)
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)
    try: 
        with session() as session:
            session.execute(statement)
            session.commit()
            return True
    except:
        return False
# endregion

# region categoryes 
async def categories_register_service(user_id: str, payload: CategoryDto) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto( 
                                            category_id = -1,
                                            category_name = '',
                                            category_color = '')
    data: ExpenseCategoryModel = ExpenseCategoryModel(
            category_name = payload.category_name,
            category_color = payload.category_color,
            user_id = user_id) 
    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session: 
            session.add(data)
            session.flush()
            session.commit()

            # setup data:
            backdata.category_id = data.category_id
            backdata.category_name = data.category_name
            backdata.category_color = data.category_color

            return backdata
    except Exception as e :
        raise Exception(f'Error in categories register service > {e}')

async def update_category_service(payload: ExpenseCategoryUpdateDto) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto(
               category_id = -1,
               category_name = '',
               category_color = ''
            )
    sel_statement = select(ExpenseCategoryModel).where(
            ExpenseCategoryModel.category_id == payload.category_id)
 
    query = update(ExpenseCategoryModel).where(
            ExpenseCategoryModel.user_id == payload.user_id,
            ExpenseCategoryModel.category_id == payload.category_id).values(payload.category.__dict__)

    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            db = session.scalars(sel_statement).first()
            session.execute(query)
            session.commit()

            backdata.category_id = db.category_id
            backdata.category_name = db.category_name
            backdata.category_color = db.category_color
            return backdata
    except Exception as e:
        print(e)
        return backdata
                        
async def delete_category_service(user_id: str, category_id: int) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto(
               category_id = -1,
               category_name = '',
               category_color = ''
            )
    sel_statement = select(ExpenseCategoryModel).where(
            ExpenseCategoryModel.category_id == category_id)
    del_statement = delete(ExpenseCategoryModel).where(
    ExpenseCategoryModel.category_id == category_id,
    ExpenseCategoryModel.user_id == user_id)

    try: 
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session:
            db = session.scalars(sel_statement).first()
            if db == None:
                return backdata
            
            backdata.category_id = db.category_id
            backdata.category_name = db.category_name
            backdata.category_color = db.category_color
            session.execute(del_statement)
            session.commit()
            return backdata
    except Exception as e:
        print(e)
        return backdata

async def get_all_categories_service(user_id: str) -> list[ExpenseCategoryReturnDto]:
    backdata: list[ExpenseCategoryReturnDto] = [ExpenseCategoryReturnDto(
                category_id = -1,
                category_name = '',
                category_color = ''
            )]
    statement = select(ExpenseCategoryModel).where(ExpenseCategoryModel.user_id == user_id)
    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session:
            db_data = session.scalars(statement).all()
            if len(db_data) == 0:
                return backdata

            backdata = []
            backdata: list[ExpenseCategoryReturnDto] = [ExpenseCategoryReturnDto(
                category_id = d.category_id,
                category_name = d.category_name,
                category_color = d.category_color) for d in db_data]
            return backdata
    except Exception as e:
        print(e)
        return backdata
# endregion


# region user 
async def get_user_name_service(user_login: payload) -> str:
    query = select(UserModel).join(LoginModel,
                                   UserModel.user_id == LoginModel.user_id).where(LoginModel.user_login == user_login)
    try: 
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            data = session.scalars(query).one()
            if data.user_name == '':
                return ''
            return data.user_name
    except Exception as e:
        print(e)
        return ''


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
