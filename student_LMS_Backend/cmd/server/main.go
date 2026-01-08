package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"student_LMS_Backend/internal/config"
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	cfg := config.Load()

	database.ConnectMySQL(cfg)

	gin.SetMode(gin.ReleaseMode)

	r := routes.SetupRouter()

	log.Println("Starting:", cfg.AppName)
	log.Println("Student LMS Backend running on :" + cfg.AppPort)

	r.Run(":" + cfg.AppPort)
}
