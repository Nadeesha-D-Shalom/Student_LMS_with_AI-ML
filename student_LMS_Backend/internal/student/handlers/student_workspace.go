package handlers

import (
	"net/http"
	"strconv"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func GetStudentWorkspace(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	classID, err := strconv.ParseUint(c.Param("classId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class id"})
		return
	}

	// gradeId is only for UI routing (not used in DB)
	_ = c.Param("gradeId")

	service := services.NewStudentWorkspaceService()

	data, err := service.GetWorkspace(studentID, classID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
