package main

import (
	"go_api/initializers"
	"go_api/model"
)

func init() {
	initializers.ConnectDb()
}

func main() {
	initializers.DB.AutoMigrate(&model.Users{})
}
