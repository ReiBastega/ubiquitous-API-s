from typing import Optional
from sqlalchemy.orm import Session
from . import models


def list_users(db: Session):
    return db.query(models.User).all()


def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def username_exists(db: Session, username: str, exclude_id: Optional[int] = None) -> Optional[models.User]:
    query = db.query(models.User).filter(models.User.username == username)
    if exclude_id is not None:
        query = query.filter(models.User.id != exclude_id)
    return query.first()


def create_user(db: Session, *, name: str, email: str, username: str, password_hash: str) -> models.User:
    user = models.User(
        name=name,
        email=email,
        username=username,
        password=password_hash,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, db_user: models.User, *, name: str, email: str, username: str, password_hash: str) -> models.User:
    db_user.name = name
    db_user.email = email
    db_user.username = username
    db_user.password = password_hash
    db.commit()
    db.refresh(db_user)
    return db_user


def get_password(db: Session, user_id: int) -> str:
    row = db.query(models.User.password).filter(models.User.id == user_id).first()
    if row is None:
        return ""
    return row[0]


def delete_user(db: Session, db_user: models.User) -> None:
    db.delete(db_user)
    db.commit()
