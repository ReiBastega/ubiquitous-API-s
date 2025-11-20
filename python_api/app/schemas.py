from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str
    email: str
    user: str

    class Config:
        from_attributes = True
