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

class AllCategoriesReturnDto(BaseModel):
    id: int
    value: int
    color: str
    name: str
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

class CompleteExpenseRegisterDto(BaseModel):
    items: list[ExpenseDto]

class QuickExpenseRegisterDto(BaseModel):
    value: int
    type: bool
    date: datetime

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

class MonthlyCategoriesDto(BaseModel):
    category_id: int
    start_month: int # 0 january
    end_month: int
    year: int

class MonthlyCategoriesReturnDto(BaseModel):
    month: int
    category_name: str
    total_expenses: int
    total_entry: int

class MonthlyDto(BaseModel):
    start_month: int
    end_month: int
    year: int

class MonthlyBalancesReturnDto(BaseModel):
    month: int
    year: int
    total_entry: int
    total_out: int

class MonthlyBalancesCompareDto(BaseModel):
    month_one: int
    year_one: int
    month_two: int
    year_two: int

# endregion
