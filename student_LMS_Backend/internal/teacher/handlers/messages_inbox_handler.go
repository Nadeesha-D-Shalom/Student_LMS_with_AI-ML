package handlers

import (
	"net/http"

	"student_LMS_Backend/internal/database"
	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

func TeacherInbox(c *gin.Context) {
	teacherID := c.GetUint64("user_id")
	search := c.Query("q")

	repo := teacherRepos.NewMessageThreadRepository(database.DB)
	items, err := repo.TeacherInbox(teacherID, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
