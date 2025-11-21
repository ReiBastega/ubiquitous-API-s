package repository

import (
	"go_api/initializers"
	"go_api/model"
)

type GetUsersRepository struct {
}

func NewGetUsersRepository() GetUsersRepository {
	return GetUsersRepository{}
}

func (g *GetUsersRepository) Call() []model.Users {
	var users []model.Users
	initializers.DB.Find(&users)
	return users
}
