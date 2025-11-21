package main

import (
	controller "go_api/controller"
	"go_api/initializers"
	repository "go_api/repository"
	usecase "go_api/usecase"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.ConnectDb()
}

func main() {

	server := gin.Default()

	GetUsersRepository := repository.NewGetUsersRepository()
	GetUsersUsecase := usecase.NewGetUsersUsecaseInstance(GetUsersRepository)
	GetUsersController := controller.NewGetUserControllerInstance(GetUsersUsecase)

	server.GET("/users", GetUsersController.Call)

	server.Run(":3001")
}
