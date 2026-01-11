package handlers

import (
	"net/http"

	"student_LMS_Backend/internal/database"

	"github.com/gin-gonic/gin"
)

type CreateMessageRequest struct {
	Type      string  `json:"type"`
	Subject   string  `json:"subject"`
	TeacherID *uint64 `json:"teacher_id"`
	Message   string  `json:"message"`
}

func CreateStudentMessage(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	var req CreateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Subject == "" || req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subject and message are required"})
		return
	}

	var receiverRole string
	var receiverID *uint64

	switch req.Type {
	case "IT":
		receiverRole = "IT_ADMIN"
		receiverID = nil
	case "INSTITUTE":
		receiverRole = "ADMIN"
		receiverID = nil
	case "SUBJECT":
		if req.TeacherID == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Teacher is required"})
			return
		}
		receiverRole = "TEACHER"
		receiverID = req.TeacherID
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message type"})
		return
	}

	_, err := database.DB.Exec(`
		INSERT INTO messages (
			student_id,
			receiver_role,
			receiver_id,
			subject,
			encrypted_content,
			last_message_at,
			is_seen
		) VALUES (?, ?, ?, ?, ?, NOW(), FALSE)
	`,
		studentID,
		receiverRole,
		receiverID,
		req.Subject,
		req.Message,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create message"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true})
}
