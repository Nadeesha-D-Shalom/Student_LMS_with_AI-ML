package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/database"
	studentRepos "student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

/*
=====================================================
Student Inbox (Thread List)
GET /api/student/messages
=====================================================
*/
func StudentInbox(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	threadRepo := studentRepos.NewMessageThreadRepository(database.DB)

	items, err := threadRepo.StudentInbox(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to load messages",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
	})
}

/*
=====================================================
Student View Single Thread
GET /api/student/messages/:threadId
=====================================================
*/
func StudentGetThread(c *gin.Context) {
	studentID := c.GetUint64("user_id")
	threadID, err := strconv.ParseUint(c.Param("threadId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid thread id",
		})
		return
	}

	threadRepo := studentRepos.NewMessageThreadRepository(database.DB)
	stackRepo := studentRepos.NewMessageStackRepository(database.DB)

	// Thread header details
	detail, err := threadRepo.StudentThreadDetail(studentID, threadID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Thread not found",
		})
		return
	}

	// Message stack (LIFO)
	stack, err := stackRepo.GetThreadStackForStudent(studentID, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to load messages",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"thread":   detail,
		"messages": stack,
	})
}
