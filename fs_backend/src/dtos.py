import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class ExpenseDto(BaseModel):
    user_id: str
    expense_value: int
    expense_date: datetime
    expense_category: str
    expense_desc: str


