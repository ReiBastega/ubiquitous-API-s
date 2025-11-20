import uvicorn
from fastapi import Body, Depends, FastAPI, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from . import crud, db as database, models
from .utils import (
    UserPayload,
    hash_password,
    user_to_dict,
    verify_email,
    verify_hash_password,
    verify_password,
)

app = FastAPI(
    title="Python Users API",
    version="1.0.0",
    # docs_url=None,   // remoção do Swagger   
    # redoc_url=None,     
    # openapi_url=None,
)


@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)


def error_response(status_code: int, code: str, message: str):
    return JSONResponse(status_code=status_code, content={"data": {"status": status_code, "code": code, "message": message}})


@app.post("/users")
def create_user(payload: dict = Body(default_factory=dict), db: Session = Depends(database.get_db)):
    try:
        params = UserPayload(payload)
        if not verify_email(params.email):
            return error_response(400, "invalid-email", "Invalid email format")
        if not verify_password(params.password):
            return error_response(400, "invalid-password", "Invalid password format. It must contains characters, number and at least 6 digits")
        if len(params.user) <= 0:
            return error_response(400, "invalid-user", "Invalid user name. This field cannot be empty")

        existing_user = crud.username_exists(db, params.user)
        hashed_pwd = hash_password(params.password or "")
        if existing_user:
            return error_response(409, "existing-user", "This user name is in use")

        crud.create_user(db, name=params.name, email=params.email, username=params.user, password_hash=hashed_pwd)
        return JSONResponse(status_code=201, content={"message": "User created with successfully"})
    except Exception:
        return error_response(500, "internal-server-error", "Internal Server Error")


@app.get("/users")
def list_users(db: Session = Depends(database.get_db)):
    try:
        result = crud.list_users(db)
        if len(result) <= 0:
            return JSONResponse(status_code=204, content={"data": {}})
        return JSONResponse(status_code=200, content={"data": [user_to_dict(u) for u in result]})
    except Exception:
        return error_response(500, "internal-server-error", "Internal Server Error")


@app.get("/users/{user_id}")
def get_user(user_id: str, db: Session = Depends(database.get_db)):
    try:
        try:
            parsed_id = int(user_id)
        except ValueError:
            return JSONResponse(status_code=422, content={"data": {"status": 422, "code": "unprocessable-entity", "messgae": "User id must be a number"}})

        user = crud.get_user(db, parsed_id)
        if not user:
            return error_response(404, "user-not-found", "User not found")
        return JSONResponse(status_code=200, content={"data": user_to_dict(user)})
    except Exception:
        return error_response(500, "internal-server-error", "Internal Server Error")


#can update any user data and dont need give his password (can change new password, username, name, email etc)
# @app.put("/users/{user_id}")
# def update_user(user_id: str, payload: dict = Body(default_factory=dict), db: Session = Depends(database.get_db)):
#     try:
#         try:
#             parsed_id = int(user_id)
#         except ValueError:
#             return JSONResponse(status_code=422, content={"data": {"status": 422, "code": "unprocessable-entity", "messgae": "User id must be a number"}})

#         params = UserPayload(payload, user_id=parsed_id)
#         existing = crud.get_user(db, parsed_id)
#         if existing is None:
#             return error_response(404, "user-not-found", "User not found")

#         if not verify_email(params.email):
#             return error_response(400, "invalid-email", "Invalid email format")
#         if not verify_password(params.password):
#             return error_response(400, "invalid-password", "Invalid password format. It must contains characters, number and at least 6 digits")
#         if len(params.user) <= 0:
#             return error_response(400, "invalid-user", "Invalid user name. This field cannot be empty")

#         current_pwd = crud.get_password(db, parsed_id)
#         is_user_in_use = crud.username_exists(db, params.user, exclude_id=existing.id)
#         is_valid_pwd = verify_hash_password(params.current_password, current_pwd)
#         new_pwd = hash_password(params.password or "")

#         if not is_valid_pwd:
#             return JSONResponse(status_code=403, content={"data": {"status": 401, "code": "unauthorized", "message": "Unauthorized, wrong password"}})
#         if is_user_in_use:
#             return error_response(409, "existing-user", "This user name is in use")

#         crud.update_user(db, existing, name=params.name, email=params.email, username=params.user, password_hash=new_pwd)
#         return JSONResponse(status_code=200, content={"message": "User updated with successfully"})
#     except Exception:
#         return error_response(500, "internal-server-error", "Internal Server Error")



@app.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(database.get_db)):
    try:
        try:
            parsed_id = int(user_id)
        except ValueError:
            return JSONResponse(status_code=422, content={"data": {"status": 422, "code": "unprocessable-entity", "messgae": "User id must be a number"}})

        existing = crud.get_user(db, parsed_id)
        if existing is None:
            return error_response(404, "user-not-found", "User not found")

        crud.delete_user(db, existing)
        return JSONResponse(status_code=200, content={"message": "User deleted with successfully"})
    except Exception:
        return error_response(500, "internal-server-error", "Internal Server Error")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=3002, reload=True)
