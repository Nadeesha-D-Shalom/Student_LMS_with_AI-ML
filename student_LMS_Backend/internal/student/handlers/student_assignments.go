package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"student_LMS_Backend/internal/student/repositories"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func GetStudentAssignments(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	var classID *uint64
	if v := c.Query("class_id"); v != "" {
		parsed, err := strconv.ParseUint(v, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class_id"})
			return
		}
		classID = &parsed
	}

	service := services.NewStudentAssignmentService()

	items, err := service.GetAllAssignments(studentID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load assignments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func GetStudentAssignmentDetail(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	assignmentID, err := strconv.ParseUint(c.Param("assignmentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid assignment id"})
		return
	}

	service := services.NewStudentAssignmentService()

	data, err := service.GetAssignmentDetail(studentID, assignmentID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

func SubmitStudentAssignment(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	assignmentID, err := strconv.ParseUint(
		c.Param("assignmentId"), 10, 64,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid assignment id"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// File size validation (5MB)
	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file size exceeds 5MB"})
		return
	}

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	service := services.NewStudentAssignmentService()

	err = service.SubmitAssignment(studentID, assignmentID, filePath)
	if err != nil {
		if err.Error() == "submission deadline has passed" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"status":  "SUBMITTED",
	})
}

func RemoveStudentAssignmentSubmission(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	assignmentID, err := strconv.ParseUint(c.Param("assignmentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid assignment id"})
		return
	}

	err = repositories.DeleteSubmission(studentID, assignmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to remove submission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
