package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/student/repositories"
)

func GetStudentMessages(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	repo := repositories.NewMessageRepository(database.DB)
	items, err := repo.GetInbox(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func GetStudentMessageThread(c *gin.Context) {
	studentID := c.GetUint64("user_id")
	messageID, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	repo := repositories.NewMessageRepository(database.DB)
	thread, err := repo.GetThread(studentID, messageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}

	c.JSON(http.StatusOK, thread)
}

func GetUnreadMessageCount(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	repo := repositories.NewMessageRepository(database.DB)
	count, _ := repo.GetUnreadCount(studentID)

	c.JSON(http.StatusOK, gin.H{"count": count})
}
