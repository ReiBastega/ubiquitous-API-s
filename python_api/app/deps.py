from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .db import get_db
from . import crud


def user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def email_or_username_taken(email: str, username: str, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, email) or crud.get_user_by_username(db, username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already exists",
        )
