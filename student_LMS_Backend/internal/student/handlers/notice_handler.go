package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type StudentNoticeHandler struct {
	Repo *repositories.StudentNoticeRepository
}

func NewStudentNoticeHandler(r *repositories.StudentNoticeRepository) *StudentNoticeHandler {
	return &StudentNoticeHandler{Repo: r}
}

func (h *StudentNoticeHandler) List(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	items, err := h.Repo.GetForStudent(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load notices"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
