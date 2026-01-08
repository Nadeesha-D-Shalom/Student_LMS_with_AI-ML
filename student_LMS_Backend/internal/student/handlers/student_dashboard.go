package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
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
