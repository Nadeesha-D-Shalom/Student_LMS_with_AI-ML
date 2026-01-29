package handlers

import (
	"net/http"
	"strings"

	"student_LMS_Backend/internal/database"
	studentRepos "student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type CreateStudentThreadRequest struct {
	TeacherID uint64 `json:"teacher_id"`
	Subject   string `json:"subject"`
	Message   string `json:"message"`
}

func StudentCreateThread(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	var req CreateStudentThreadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	req.Subject = strings.TrimSpace(req.Subject)
	req.Message = strings.TrimSpace(req.Message)

	if req.TeacherID == 0 || req.Subject == "" || req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	threadRepo := studentRepos.NewMessageThreadRepository(database.DB)
	stackRepo := studentRepos.NewMessageStackRepository(database.DB)

	// ✅ CREATE THREAD WITH PENDING STATUS
	threadID, err := threadRepo.CreateThread(studentID, req.TeacherID, req.Subject)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}

	// First message
	err = stackRepo.PushMessage(
		threadID,
		"STUDENT",
		studentID,
		"TEACHER",
		req.TeacherID,
		req.Message,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	_ = threadRepo.UpdateLastMessageAt(threadID)

	c.JSON(http.StatusCreated, gin.H{
		"thread_id": threadID,
	})
}
