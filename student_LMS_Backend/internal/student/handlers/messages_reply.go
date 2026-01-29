package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"student_LMS_Backend/internal/database"
	studentRepos "student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type StudentReplyRequest struct {
	Message string `json:"message"`
}

func StudentReply(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	threadID, err := strconv.ParseUint(c.Param("threadId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread id"})
		return
	}

	var req StudentReplyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message is required"})
		return
	}

	threadRepo := studentRepos.NewMessageThreadRepository(database.DB)
	stackRepo := studentRepos.NewMessageStackRepository(database.DB)

	thread, err := threadRepo.StudentThreadDetail(studentID, threadID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	// ❌ BLOCK ONLY IF COMPLETED
	if thread.Status == "COMPLETED" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Conversation is closed"})
		return
	}

	err = stackRepo.PushMessage(
		threadID,
		"STUDENT",
		studentID,
		"TEACHER",
		thread.TeacherID,
		req.Message,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	// Back to REVIEW
	_, _ = database.DB.Exec(`
		UPDATE message_threads
		SET last_message_at = NOW(), status = 'REVIEW'
		WHERE id = ?
	`, threadID)

	c.JSON(http.StatusOK, gin.H{"success": true})
}
