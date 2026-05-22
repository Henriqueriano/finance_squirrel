import uuid
import uuid_utils as ud
from typing import List
from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import DECIMAL, Integer, String, DateTime, UUID, ForeignKey, Boolean

class Base(DeclarativeBase):
    pass

class ExpenseCategoryModel(Base):
    __tablename__ : str  = 'expenses_categories_table'

    category_id: Mapped[int] = mapped_column(Integer, primary_key = True)
    category_name: Mapped[str] = mapped_column(String(50), nullable = False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    category_color: Mapped[str] = mapped_column(String(20), nullable= False) # in hex sample: #FFFFFFFF
    
    expenses: Mapped[list['ExpenseModel']] = relationship(back_populates = 'categories')
    users: Mapped['UserModel'] = relationship(back_populates = 'categoryes')

class ExpenseModel(Base):
    __tablename__ : str  = 'expenses_table'

    expense_id: Mapped[int] = mapped_column(Integer, primary_key = True) 
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    expense_value: Mapped[int] = mapped_column(Integer, nullable = False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone = True),
                                                 nullable = False,
                                                 default= lambda: datetime.now(timezone.utc)) 
    expense_date: Mapped[datetime] = mapped_column(DateTime(timezone = True), nullable = True, default=None) 
    expense_type: Mapped[bool] = mapped_column(Boolean, nullable = False)
    category_id: Mapped[int] = mapped_column(ForeignKey('expenses_categories_table.category_id'))
    expense_desc: Mapped[str] = mapped_column(String(300), nullable = True, default=None)

    users: Mapped['UserModel'] = relationship(back_populates = 'expenses')
    categories: Mapped['ExpenseCategoryModel'] = relationship(back_populates = 'expenses')

class UserModel(Base):
    __tablename__ = 'users_table'

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid = True), primary_key = True, default = ud.uuid7()) 
    user_name: Mapped[str] = mapped_column(String(100), nullable = False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)    

    config: Mapped['UserSettingModel'] = relationship(back_populates='users')
    expenses: Mapped[List['ExpenseModel']] = relationship(back_populates = 'users')
    categoryes: Mapped['ExpenseCategoryModel'] = relationship(back_populates = 'users')
    login: Mapped['LoginModel'] = relationship(back_populates = 'users')

class UserSettingModel(Base):
    __tablename__ : str = 'user_setting_table'

    config_id : Mapped[int] = mapped_column(Integer, primary_key = True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    theme_config: Mapped[str] = mapped_column(String(50), nullable = True, default = "light")
    exchange_config: Mapped[str] = mapped_column(String(100), nullable = True, default = "real")
    date_format_config: Mapped[str] = mapped_column(String(100), nullable = True, default = "nominal")

    users : Mapped['UserModel'] = relationship(back_populates='config')

class LoginModel(Base):
    __tablename__ : str = 'login_table'

    login_id: Mapped[int] = mapped_column(Integer, primary_key = True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users_table.user_id'))
    user_login: Mapped[str] = mapped_column(String(100), nullable = False, unique = True)
    user_password: Mapped[str] = mapped_column(String(255), nullable = False)

    users: Mapped['UserModel'] = relationship(back_populates = 'login')
