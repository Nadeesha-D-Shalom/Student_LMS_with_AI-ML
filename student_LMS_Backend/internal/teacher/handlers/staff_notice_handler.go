package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type StaffNoticeHandler struct {
	Repo *repositories.StaffNoticeRepository
}

func NewStaffNoticeHandler(r *repositories.StaffNoticeRepository) *StaffNoticeHandler {
	return &StaffNoticeHandler{Repo: r}
}

func (h *StaffNoticeHandler) List(c *gin.Context) {
	items, err := h.Repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load notices"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
