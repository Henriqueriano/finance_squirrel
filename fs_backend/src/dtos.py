import uuid
from datetime import datetime
from pydantic import BaseModel

class LoginDto(BaseModel):
    user_login: str
    user_password: str

class RegisterDto(BaseModel):
    user_login: str
    user_password: str
    user_name: str

class ExpensesDto(BaseModel):
    expense_value: int
    expense_date: datetime
    expense_type: bool
    category_id: int
    expense_desc: str

class ExpensesReturnDto(BaseModel):
    expense_id: int
    expense_value: int
    expense_date: datetime
    expense_type: bool
    category_id: int
    expense_desc: str

class ExpensesCategoryDto(BaseModel):
    category_name: str
    category_color: str

class ExpensesCategoryReturnDto(BaseModel):
    category_id: int
    category_name: str
    category_color: str

class UserDto(BaseModel):
    user_name: str

class UserSettingDto(BaseModel):
    theme_config: str
    exchange_config: str
    date_format_config: str