package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetClassGrades(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	classID, err := strconv.ParseUint(
		c.Param("classId"),
		10,
		64,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid class id",
		})
		return
	}

	service := services.NewStudentClassService()
	grades, err := service.GetGrades(studentID, classID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": grades,
	})
}
