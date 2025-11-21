package model

type Users struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	User     string `json:"user"`
	Password string `json:"password"`
}

func (Users) TableName() string {
	return "Users"
}
