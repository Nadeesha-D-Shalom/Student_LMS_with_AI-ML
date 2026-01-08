package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"student_LMS_Backend/internal/services"
)

func StudentDashboard(c *gin.Context) {
	studentUserID := c.GetUint64("user_id")

	service := services.NewStudentDashboardService()

	data, err := service.GetDashboard(studentUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load dashboard",
		})
		return
	}

	c.JSON(http.StatusOK, data)
}
