import re
import bcrypt
from .models import User
from .schemas import User


EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@gmail\.com(\.br)?$", re.IGNORECASE)
SALT_ROUNDS = 10


class UserPayload:
    def __init__(self, data: dict, user_id: int | None = None):
        self.id: int | None = user_id
        self.name: str = (data.get("name") or "").strip()
        self.email: str = (data.get("email") or "").strip()
        self.user: str = (data.get("user") or "").strip()
        raw_password = data.get("password")
        self.password: str | None = None if raw_password is None else str(raw_password).strip()
        current_pwd = data.get("currentPassword")
        self.current_password: str = "" if current_pwd is None else str(current_pwd)


def verify_email(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email))


def verify_password(password: str | None) -> bool:
    if password is None:
        return False
    return bool(re.search(r"[0-9]", password) and re.search(r"[a-zA-Z]", password) and len(password) >= 6)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=SALT_ROUNDS)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_hash_password(password: str, hashed: str) -> bool:
    if not hashed:
        return False
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "user": user.username,
    }


def serialize_users(users: list[User]) -> list[User]:
    return [User(**user_to_dict(u)) for u in users]
