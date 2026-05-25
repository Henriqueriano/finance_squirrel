import os
import jwt
import uuid
import bcrypt
import datetime
from .dtos import *
from .models import *
from datetime import datetime
from datetime import timedelta
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select, update, delete, func, extract

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
        print(f'Aux create user error > {e}')

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
        print(f'Error in user exists service > {e}')


async def login_service(payload: LoginDto) -> AuthReturnDto:
    data: AuthReturnDto = AuthReturnDto(id = '', name = '', auth = '')
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        query = select(LoginModel, UserModel).join(UserModel,
                      LoginModel.user_id == UserModel.user_id).where(
                      LoginModel.user_login == payload.user_login)
        if_exists = select(LoginModel, UserModel).join(UserModel,
                      LoginModel.user_id == UserModel.user_id).where(
                      LoginModel.user_login == payload.user_login).exists()

        with Session() as session:
            exists = session.scalar(select(if_exists)) 
            if exists:
                    lm, um = session.execute(query).first()
                    user_passw: str = (payload.user_password + SECRET_KEY).encode('utf-8')
                    passw: str = lm.user_password.encode('utf-8')
                    if bcrypt.checkpw(user_passw, passw):
                        data.id = str(lm.user_id)
                        data.name = um.user_name
                        data.auth = aux_create_jwt(str(lm.user_id))
            return data
    except Exception as e:
        print(f'Login service exception > {e}') 
        return data

async def register_service(payload: RegisterDto) -> AuthReturnDto:
    backdata: AuthReturnDto = AuthReturnDto(id = '', name = '', auth = '')
    try:
        encoded_pass = (payload.user_password + SECRET_KEY).encode('utf-8')
        data: LoginModel = LoginModel(
                user_id = aux_create_user(payload.user_name),
                user_login = payload.user_login,
                user_password = bcrypt.hashpw(encoded_pass, bcrypt.gensalt(rounds = 4)).decode('utf-8')
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
        print(f'Register user service error > {e}')
        return backdata

# endregion

# region expenses
async def expenses_bulk_register_service(user_id: str, payload: list[ExpenseDto]) -> list[ExpenseReturnDto]: 
    data: list[ExpenseModel] = [ExpenseModel(
        user_id = user_id,
        expense_value = e.value,
        expense_date = e.date,
        expense_type = e.type,
        category_id = getDefaultCategoryId(user_id) if e.category_id == 0 else e.category_id,
        expense_desc = e.description) for e in payload]
    statement = select(ExpenseModel).where(ExpenseModel.user_id == user_id)
    backdata: list[ExpenseReturnDto] = []

    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session: 
            session.add_all(data)
            session.commit()

            for exp in data:
                session.refresh(exp)
                backdata.append(ExpenseReturnDto(
                    id = exp.expense_id,
                    value = exp.expense_value,
                    date = exp.expense_date,
                    type = exp.expense_type,
                    category_id = exp.category_id,
                    description = exp.expense_desc
                ))

        for exp in backdata:
            exp.date = exp.date.strftime("%Y-%m-%dT%H:%M:%SZ")

        return backdata

    except Exception as e:
        print(f'Register expense service error > {e}')

async def get_expenses(user_id: str) -> list[ExpenseReturnDto]:
    statement = select(ExpenseModel).where(ExpenseModel.user_id == user_id)
    backdata: list[ExpenseReturnDto] = []

    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session:
            db_data = session.scalars(statement).all()
            for d in db_data:
                backdata.append(ExpenseReturnDto(
                id = d.expense_id,
                value = d.expense_value,
                date = d.expense_date,
                type = d.expense_type,
                category_id = d.category_id,
                description = d.expense_desc))

            for d in backdata:
                d.date = d.date.strftime("%Y-%m-%dT%H:%M:%SZ")

            print(backdata)
            return backdata

    except Exception as e:
        print(f'Get expense service error > {e}')

async def update_expense_service(user_id, expense_id, payload: ExpenseDto) -> ExpenseReturnDto:
    sel_statement = select(ExpenseModel).where(ExpenseModel.expense_id == expense_id)
    statement = update(ExpenseModel).values(
            expense_value = payload.value,
            expense_date = payload.date,
            expense_type = payload.type,
            category_id = payload.category_id,
            expense_desc = payload.description).where(
                    ExpenseModel.expense_id == expense_id 
                    and ExpenseModel.user_id == user_id)
    backdata: ExpenseReturnDto = ExpenseReturnDto(id = -1, 
                    value = -1,
                    date = datetime.now(),
                    type = False,
                    category_id = -1,
                    description = '')   

    try: 
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session:
            db_data = session.scalar(sel_statement)
            if db_data:        
                session.execute(statement)
                session.commit()
                backdata.id = db_data.expense_id
                backdata.value = db_data.expense_value
                backdata.date = str(db_data.expense_date)
                backdata.type = db_data.expense_type
                backdata.category_id = db_data.category_id
                backdata.description = db_data.expense_desc
            return backdata
    except Exception as e:
        print(f'Update expense service error > {e}')

async def delete_expense_service(user_id: str, expense_id: int) -> ExpenseReturnDto:
    sel_statement = select(ExpenseModel).where(ExpenseModel.expense_id == expense_id)
    statement = delete(ExpenseModel).where(
            ExpenseModel.expense_id == expense_id,
            ExpenseModel.user_id == user_id)
    backdata: ExpenseReturnDto = ExpenseReturnDto(
                    id = -1, 
                    value = -1,
                    date = datetime.now(timezone.utc),
                    type = False,
                    category_id = -1,
                    description = '')
    try: 
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session:
            db_data = session.scalar(sel_statement)
            if db_data:        
                backdata.id = db_data.expense_id
                backdata.value = db_data.expense_value
                backdata.date = str(db_data.expense_date)
                backdata.type = db_data.expense_type
                backdata.category_id = db_data.category_id
                backdata.description = db_data.expense_desc
                session.execute(statement)
                session.commit()
            return backdata
    except Exception as e:
        print(f'Delete expense service error > {e}')
# endregion

# region categoryes 
def getDefaultCategoryId(user_id: str) -> int:
    query = select(ExpenseCategoryModel.category_id).where(ExpenseCategoryModel.user_id == user_id,
                                                           ExpenseCategoryModel.category_name == 'default')
    default_data = ExpenseCategoryModel(
                category_name = 'default',
                category_color = '#F0F0F0',
                user_id = user_id)
    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind = engine)
        with session() as session:
            data = session.scalar(query) 
            if data:
                return data
            session.add(default_data)
            session.flush()
            session.commit()
            return default_data.category_id

    except Exception as e:
        print(f'Exception in getDefaultCategoryId > {e}')

async def categories_register_service(user_id: str, payload: CategoryDto) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto( 
                                            id = -1,
                                            name = '',
                                            color = '')
    data: ExpenseCategoryModel = ExpenseCategoryModel(
            category_name = payload.name,
            category_color = payload.color,
            user_id = user_id) 

    try:
        engine = create_engine(DATABASE_URL)
        session = sessionmaker(bind=engine)
        with session() as session: 
            session.add(data)
            session.flush()
            session.commit()

            # setup data:
            backdata.id = data.category_id
            backdata.name = data.category_name
            backdata.color = data.category_color

            return backdata
    except Exception as e :
        print(f'Error in categories register service > {e}')

async def update_category_service(category_id: int, user_id: str, payload: CategoryDto) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto(
               id = -1,
               name = '',
               color = ''
            )
    sel_statement = select(ExpenseCategoryModel).where(
            ExpenseCategoryModel.category_id == category_id)
 
    query = update(ExpenseCategoryModel).where(
            ExpenseCategoryModel.user_id == user_id,
            ExpenseCategoryModel.category_id == category_id).values(category_name = payload.name, category_color = payload.color)

    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            db = session.scalars(sel_statement).first()
            session.execute(query)
            session.commit()

            backdata.id = db.category_id
            backdata.name = db.category_name
            backdata.color = db.category_color
            return backdata

    except Exception as e:
        print(e)
        return backdata
                        
async def delete_category_service(user_id: str, category_id: int) -> ExpenseCategoryReturnDto:
    backdata: ExpenseCategoryReturnDto = ExpenseCategoryReturnDto(
               id = -1,
               name = '',
               color = ''
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
            
            backdata.id = db.category_id
            backdata.name = db.category_name
            backdata.color = db.category_color
            session.execute(del_statement)
            session.commit()
            return backdata
    except Exception as e:
        print(e)
        return backdata

async def get_all_categories_service(user_id: str) -> list[ExpenseCategoryReturnDto]:
    backdata: list[ExpenseCategoryReturnDto] = []
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
                id = d.category_id,
                name = d.category_name,
                color = d.category_color) for d in db_data]
            return backdata
    except Exception as e:
        print(e)
        return backdata
# endregion


# region user 
async def get_user_name_service(user_login: str) -> str:
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
# endregion

# region computed
async def categories_expenses_service(user_id: str) -> list[AllCategoriesReturnDto]:
    backdata : list[AllCategoriesReturnDto] = []
    query = select(
            ExpenseCategoryModel.category_id,
            ExpenseCategoryModel.category_name,
            ExpenseCategoryModel.category_color,
            func.sum(ExpenseModel.expense_value)).join(ExpenseModel,
            ExpenseCategoryModel.category_id == ExpenseModel.category_id
            ).where(ExpenseModel.user_id == user_id,
                    ExpenseModel.expense_type == 'f').group_by(ExpenseCategoryModel.category_id) 
    try: 
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            data = session.execute(query)
            for id, name, color, value in data:
                backdata.append(AllCategoriesReturnDto(
                    id = id,
                    name = name,
                    color = color,
                    value = value))
            return backdata
    except Exception as e:
        print(f'Exception in categories_expenses_service > {e}')
        return backdata

async def total_balance_service(user_id: str, year: int) -> dict:
    backdata : dict = {'receitas' : 0, 'despesas' : 0}
    query = select(ExpenseModel.expense_type,
                   func.sum(ExpenseModel.expense_value)).where(
                        ExpenseModel.user_id == user_id,
                        extract('year', ExpenseModel.expense_date) == year
                   ).group_by(ExpenseModel.expense_type)
    try: 
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind = engine)
        with Session() as session:
            data = session.execute(query)
            for k, v in data:
                if k:
                    backdata['receitas'] = v
                    continue
                backdata['despesas'] = v
            return backdata

    except Exception as e:
        print(f'Exception in total_balance_service > {e}')
        return backdata

def get_monthly_category_value(user_id: str, category_id: int, month: int, year: int) -> MonthlyCategoriesReturnDto:
    backdata: MonthlyCategoriesReturnDto = MonthlyCategoriesReturnDto(month = month - 1, category_name = '', total_entry = 0, total_out = 0)
    query = select(
                    ExpenseCategoryModel.category_name,
                    ExpenseModel.expense_date,
                    ExpenseModel.expense_type,
                    func.sum(ExpenseModel.expense_value)).join(ExpenseCategoryModel, 
                    ExpenseCategoryModel.category_id == ExpenseModel.category_id
                    ).where( 
                    ExpenseModel.user_id == user_id,
                    ExpenseCategoryModel.category_id == category_id,
                    extract('month', ExpenseModel.expense_date) + 1 == month,
                    extract('year', ExpenseModel.expense_date)  == year
                    ).group_by(ExpenseModel.expense_date, ExpenseCategoryModel.category_name, ExpenseModel.expense_type)

    try: 
       engine = create_engine(DATABASE_URL)
       session = sessionmaker(bind = engine)
       with session() as session:
            data = session.execute(query)
            for d in data:
                backdata.category_name = d[0]
                if d[2]:
                    backdata.total_entry = d[3]
                    continue
                backdata.total_out = d[3]
       return backdata

    except Exception as e:
        print(f'Exception in get_monthly_category_value > {e}')

async def categories_monthly_service(user_id: str, payload: MonthlyCategoriesDto) -> list[MonthlyCategoriesReturnDto]:
    start = payload.start_month + 1
    end = payload.end_month + 1
    year = payload.year
    category_id = payload.category_id
    backdata: list[MonthlyCategoriesReturnDto] = []
    for month in range(start, end):
        backdata.append(get_monthly_category_value(user_id, category_id, month, end, year))
    return backdata

async def balances_monthly_service(user_id: str, payload: MonthlyDto) -> list[MonthlyBalancesReturnDto]:
    start = payload.start_month + 1
    end = payload.end_month + 1
    year = payload.year
    backdata: list[MonthlyBalancesReturnDto] = []
    for month in range(start, end):
        backdata.append(get_monthly_balance_value(user_id, month, year))

    return backdata 

def get_monthly_balance_value(user_id: str, month: int, year: int) -> MonthlyCategoriesReturnDto:
    backdata: MonthlyBalancesReturnDto = MonthlyBalancesReturnDto(month = month - 1, year = year, total_entry = 0, total_out = 0)
    query = select(
                    ExpenseModel.expense_type,
                    func.sum(ExpenseModel.expense_value)
                    ).where( 
                    ExpenseModel.user_id == user_id,
                    extract('month', ExpenseModel.expense_date) + 1 == month,
                    extract('year', ExpenseModel.expense_date)  == year).group_by(ExpenseModel.expense_type)

    try: 
       engine = create_engine(DATABASE_URL)
       session = sessionmaker(bind = engine)
       with session() as session:
            data = session.execute(query)
            for d in data:
                if d[0]:
                    backdata.total_entry = d[1]
                    continue
                backdata.total_out = d[1]
            return backdata

    except Exception as e:
        print(f'Exception in get_monthly_category_value > {e}')

async def balances_monthly_compare_service(user_id: str, payload: MonthlyBalancesCompareDto) -> list[MonthlyBalancesReturnDto]:
    backdata: list[MonthlyBalancesReturnDto] = []
    month_one: int = payload.month_one + 1
    month_two: int = payload.month_two + 1
    year_one: int = payload.year_one
    year_two: int = payload.year_two
    backdata.append(get_monthly_balance_value(user_id, month_one, year_one))
    backdata.append(get_monthly_balance_value(user_id, month_two, year_two))
    return backdata

async def get_categories_value_without_id(user_id, start, end, year) -> list[MonthlyCategoriesReturnDto]:
    backdata: MonthlyCategoriesReturnDto = MonthlyCategoriesReturnDto(month = start - 1, category_name = '', total_entry = 0, total_expenses = 0)
    expenses = select(
                    ExpenseCategoryModel.category_name,
                    ExpenseModel.expense_type,
                    func.sum(ExpenseModel.expense_value)).join(ExpenseCategoryModel, 
                    ExpenseCategoryModel.category_id == ExpenseModel.category_id
                    ).where( 
                    ExpenseModel.user_id == user_id,
                    extract('month', ExpenseModel.expense_date) + 1 == start,
                    extract('month', ExpenseModel.expense_date) + 1 <= end,
                    extract('year', ExpenseModel.expense_date) == year,
                    ).group_by(ExpenseCategoryModel.category_name, ExpenseModel.expense_type)

    try: 
       engine = create_engine(DATABASE_URL)
       session = sessionmaker(bind = engine)
       with session() as session:
            expenses = session.execute(expenses)
            for e in expenses:
                backdata.category_name = e[0]
                if e[1]:
                    backdata.total_entry = e[2]
                    continue
                backdata.total_expenses = e[2]
       return backdata

    except Exception as e:
        print(f'Exception in get_categories_value_without_id > {e}')

async def get_monthly_categories_cost(user_id, start, end, year) -> list[MonthlyCategoriesReturnDto]:
    backdata: list[MonthlyCategoriesCostReturnDto] = []
    categoryes = select(ExpenseCategoryModel.category_id,
                        ExpenseCategoryModel.category_name) \
                .distinct(ExpenseCategoryModel.category_id) \
                .join(ExpenseModel,
                      ExpenseCategoryModel.category_id == ExpenseModel.category_id) \
                .where(ExpenseModel.user_id == user_id,
                       extract('month', ExpenseModel.expense_date) + 1 >= start,
                       extract('month', ExpenseModel.expense_date) + 1 <= end,
                       extract('year', ExpenseModel.expense_date) == year)

    try: 
       engine = create_engine(DATABASE_URL)
       session = sessionmaker(bind = engine)
       with session() as session:
            categoryes = session.execute(categoryes)
            for category in categoryes:
                bucket_expense = select(func.sum(ExpenseModel.expense_value)) \
                                .where(ExpenseModel.user_id == user_id,
                                       ExpenseModel.category_id == category[0],
                                       ExpenseModel.expense_type == 'f')
                expenses = session.scalar(bucket_expense)
                backdata.append(MonthlyCategoriesCostReturnDto(id = category[0],
                                                               name = category[1],
                                                               total = expenses if expenses else 0))
       return backdata

    except Exception as e:
        print(f'Exception in get_categories_value_without_id_a > {e}')


async def get_categories_month_service(user_id: str, payload: MonthlyDto) -> list[MonthlyCategoriesDto]:
    start = payload.start_month
    end = payload.end_month
    year = payload.year
    backdata = await get_monthly_categories_cost(user_id, start, end, year)
    return backdata

   
