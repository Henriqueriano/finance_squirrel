import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class LoginDto(BaseModel):
    user_login: str
    user_password: str

class RegisterDto(BaseModel):
    user_login: str
    user_pass: str
    user_name: str

class ExpensesDto(BaseModel):
    user_id: uuid.UUID 
    expense_value: int
    expense_date: datetime
    category_id: int
    expense_desc: str

class ExpensesCategoryDto(BaseModel):
    category_name: str
    user_id: uuid.UUID 

class ExpensesCategoryReturnDto(BaseModel):
    category_id: int
    category_name: str

class UserDto(BaseModel):
    user_name: str