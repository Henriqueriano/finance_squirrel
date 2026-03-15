from __future__ import annotations
import uuid
from typing import List
from datetime import datetime, timezone
from decimal import Decimal
from pydantic import BaseModel, Field
from sqlalchemy import DECIMAL, types, Integer, String, DateTime, UUID, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Expenses(Base):
    __tablename__ = 'expenses_table'

    expense_id: Mapped[int] = mapped_column(Integer, primary_key = True) 
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    expense_value: Mapped[int] = mapped_column(Integer, nullable = False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone = True),
                                                 nullable = False,
                                                 default= lambda: datetime.now(timezone.utc)) 
    expense_date: Mapped[datetime] = mapped_column(DateTime(timezone = True), nullable = True, default=None) 
    expense_category: Mapped[str] = mapped_column(String(50), nullable = True, default=None)
    expense_desc: Mapped[str] = mapped_column(String(300), nullable = True, default=None)
    users: Mapped["Users"] = relationship(back_populates = 'expenses')

class Users(Base):
    __tablename__ = 'users_table'
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4) 
    expenses: Mapped[List["Expenses"]] = relationship(back_populates = 'users')
