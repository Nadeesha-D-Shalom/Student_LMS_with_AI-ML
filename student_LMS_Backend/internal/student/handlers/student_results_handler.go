package handlers

import (
	"net/http"

	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func GetStudentResults(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	svc := services.NewStudentResultsService()
	items, err := svc.List(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load results"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
