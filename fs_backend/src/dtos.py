import uuid
from datetime import datetime
from pydantic import BaseModel

# region aux
class CategoryDto(BaseModel):
    category_name: str
    category_color: str

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
    expense_value: int
    expense_date: datetime
    expense_type: bool
    category_id: int
    expense_desc: str

class ExpenseReturnDto(BaseModel):
    expense_id: int
    expense_value: int
    expense_date: datetime
    expense_type: bool
    category_id: int
    expense_desc: str

class ExpenseCategoryDto(BaseModel):
    user_id: str
    category: CategoryDto

class ExpenseCategoryUpdateDto(BaseModel):
    user_id: str
    category_id: int
    category: CategoryDto

class ExpenseCategoryReturnDto(BaseModel):
    category_id: int
    category_name: str
    category_color: str

class UserSettingDto(BaseModel):
    theme_config: str
    exchange_config: str
    date_format_config: str

# endregion
