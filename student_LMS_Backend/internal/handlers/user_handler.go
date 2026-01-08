package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"student_LMS_Backend/internal/services"
)

func GetMe(c *gin.Context) {
	userID := c.GetUint64("user_id")

	userService := services.NewUserService()

	user, err := userService.GetCurrentUser(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}
