package controller

import (
	getusersusecase "go_api/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type getUsersController struct {
	usecase getusersusecase.GetUsersUsecase
}

func NewGetUserControllerInstance(usecase getusersusecase.GetUsersUsecase) getUsersController {
	return getUsersController{
		usecase: usecase,
	}
}

func (g *getUsersController) Call(ctx *gin.Context) {
	value := g.usecase.Call()
	ctx.JSON(http.StatusOK, value)
}
