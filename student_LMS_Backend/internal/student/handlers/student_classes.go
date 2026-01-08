package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func GetStudentClasses(c *gin.Context) {
	studentUserID := c.GetUint64("user_id")

	service := services.NewStudentClassesService()

	classes, err := service.GetStudentClasses(studentUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load student classes",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": classes,
	})
}
