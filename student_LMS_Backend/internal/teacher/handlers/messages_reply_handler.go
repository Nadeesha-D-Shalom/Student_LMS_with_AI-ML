package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"student_LMS_Backend/internal/database"
	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherReplyRequest struct {
	Message string `json:"message"`
}

func TeacherReply(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	threadID, err := strconv.ParseUint(c.Param("threadId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread id"})
		return
	}

	var req TeacherReplyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message is required"})
		return
	}

	threadRepo := teacherRepos.NewMessageThreadRepository(database.DB)
	stackRepo := teacherRepos.NewMessageStackRepository(database.DB)

	// Validate ownership + get student_id
	detail, err := threadRepo.TeacherThreadDetail(teacherID, threadID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	// ❌ DO NOT ALLOW REPLY IF CLOSED
	if detail.Status == "COMPLETED" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Conversation is closed"})
		return
	}

	// Push teacher reply
	if err := stackRepo.PushTeacherReply(
		threadID,
		teacherID,
		detail.StudentID,
		req.Message,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reply"})
		return
	}

	// ✅ Touch timestamp
	_ = threadRepo.TouchLastMessageAt(threadID)

	// ✅ Ensure status is REVIEW (NOT COMPLETED)
	_, _ = database.DB.Exec(`
		UPDATE message_threads
		SET status = 'REVIEW'
		WHERE id = ? AND status != 'COMPLETED'
	`, threadID)

	c.JSON(http.StatusOK, gin.H{"success": true})
}
