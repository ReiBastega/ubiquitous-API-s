from sqlalchemy import Column, Integer, String
from .db import Base


class User(Base):
    __tablename__ = "Users"  

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    username = Column("user", String(255), nullable=False, index=True)
    password = Column(String(255), nullable=False)
