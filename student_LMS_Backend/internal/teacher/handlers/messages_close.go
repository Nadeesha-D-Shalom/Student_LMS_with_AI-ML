package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/database"

	"github.com/gin-gonic/gin"
)

func TeacherCloseThread(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	threadID, err := strconv.ParseUint(c.Param("threadId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread id"})
		return
	}

	res, err := database.DB.Exec(`
		UPDATE message_threads
		SET status = 'COMPLETED'
		WHERE id = ? AND teacher_id = ?
	`, threadID, teacherID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close thread"})
		return
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
