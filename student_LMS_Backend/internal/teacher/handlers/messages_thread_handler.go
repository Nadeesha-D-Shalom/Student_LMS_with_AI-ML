package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/database"
	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

func TeacherGetThread(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	threadID, err := strconv.ParseUint(c.Param("threadId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread id"})
		return
	}

	threadRepo := teacherRepos.NewMessageThreadRepository(database.DB)
	stackRepo := teacherRepos.NewMessageStackRepository(database.DB)

	detail, err := threadRepo.TeacherThreadDetail(teacherID, threadID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":     "Thread not found",
			"thread_id": threadID,
			"teacherID": teacherID,
			"debug":     err.Error(),
		})
		return
	}

	_ = threadRepo.MarkReviewIfPending(threadID)
	stackRepo.MarkTeacherMessagesRead(threadID, teacherID)

	stack, err := stackRepo.GetThreadStack(threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load messages"})
		return
	}

	detail, _ = threadRepo.TeacherThreadDetail(teacherID, threadID)

	c.JSON(http.StatusOK, gin.H{
		"thread":   detail,
		"messages": stack,
	})
}
