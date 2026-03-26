import uuid
from typing import List
from decimal import Decimal
from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import DECIMAL, types, Integer, String, DateTime, UUID, ForeignKey

class Base(DeclarativeBase):
    pass

class ExpenseCategoryModel(Base):
    __tablename__ = 'expenses_categoryes_table'

    category_id: Mapped[int] = mapped_column(Integer, primary_key = True)
    category_name: Mapped[str] = mapped_column(String(50), nullable = False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    
    expenses: Mapped['ExpenseModel'] = relationship(back_populates = 'categoryes')
    users: Mapped['UserModel'] = relationship(back_populates = 'categoryes')

class ExpenseModel(Base):
    __tablename__ = 'expenses_table'

    expense_id: Mapped[int] = mapped_column(Integer, primary_key = True) 
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    expense_value: Mapped[int] = mapped_column(Integer, nullable = False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone = True),
                                                 nullable = False,
                                                 default= lambda: datetime.now(timezone.utc)) 
    expense_date: Mapped[datetime] = mapped_column(DateTime(timezone = True), nullable = True, default=None) 
    category_id: Mapped[int] = mapped_column(ForeignKey('expenses_categoryes_table.category_id'))
    expense_desc: Mapped[str] = mapped_column(String(300), nullable = True, default=None)
    transaction_type: Mapped[bool] = mapped_column(default= False, nullable = True)

    users: Mapped['UserModel'] = relationship(back_populates = 'expenses')
    categoryes: Mapped['ExpenseCategoryModel'] = relationship(back_populates = 'expenses')

class UserModel(Base):
    __tablename__ = 'users_table'
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid7) 
    user_name: Mapped[str] = mapped_column(String(100), nullable = False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)    
    expenses: Mapped[List['ExpenseModel']] = relationship(back_populates = 'users')
    categoryes: Mapped['ExpenseCategoryModel'] = relationship(back_populates = 'users')

