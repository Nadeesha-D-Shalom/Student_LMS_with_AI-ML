package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"student_LMS_Backend/internal/repositories"

	"student_LMS_Backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetStudentAssignments(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	service := services.NewStudentAssignmentService()

	items, err := service.GetAllAssignments(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load assignments",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
	})
}

func GetStudentAssignmentDetail(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	assignmentID, err := strconv.ParseUint(
		c.Param("assignmentId"), 10, 64,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid assignment id",
		})
		return
	}

	service := services.NewStudentAssignmentService()

	data, err := service.GetAssignmentDetail(studentID, assignmentID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, data)
}

func SubmitStudentAssignment(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	assignmentID, err := strconv.ParseUint(c.Param("assignmentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid assignment ID"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// Save file
	uploadDir := "uploads/assignments"
	_ = os.MkdirAll(uploadDir, 0755)

	filePath := fmt.Sprintf(
		"%s/%d_%d_%s",
		uploadDir,
		assignmentID,
		studentID,
		file.Filename,
	)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	err = repositories.SaveSubmissionFile(
		assignmentID,
		studentID,
		filePath,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save submission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
