package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func StudentLiveClasses(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	service := services.NewStudentLiveClassesService()
	data, err := service.Get(studentID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load live classes",
		})
		return
	}

	c.JSON(http.StatusOK, data)
}
