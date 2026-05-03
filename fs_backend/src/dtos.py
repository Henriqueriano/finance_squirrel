import uuid
from datetime import datetime
from pydantic import BaseModel

# region aux
class CategoryDto(BaseModel):
    name: str
    color: str

class ExpenseReturnDto(BaseModel):
    expense_id: int
    expense_value: int
    expense_date: str
    expense_type: bool
    category_id: int
    expense_desc: str

# endregion

# region dtos
class LoginDto(BaseModel):
    user_login: str
    user_password: str

class AuthReturnDto(BaseModel):
    id: str
    name: str
    auth: str

class RegisterDto(BaseModel):
    user_login: str
    user_password: str
    user_name: str

class ExpenseDto(BaseModel):
    value: int
    date: datetime
    type: bool
    category_id: int
    description: str

class ExpenseRegisterDto(BaseModel):
    items: list[ExpenseDto]

class ExpenseUpdateDto(BaseModel):
    expense_id: int
    expense: ExpenseDto

class ExpenseReturnDto(BaseModel):
    id: int
    value: int
    date: datetime
    type: bool
    id: int
    category_id: int
    description: str

class ExpenseCategoryReturnDto(BaseModel):
    id: int
    name: str
    color: str

class UserSettingDto(BaseModel):
    theme_config: str
    exchange_config: str
    date_format_config: str

# endregion
