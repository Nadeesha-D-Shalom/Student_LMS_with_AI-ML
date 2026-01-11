package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type AnnouncementHandler struct {
	Repo *repositories.AnnouncementRepository
}

func NewAnnouncementHandler(repo *repositories.AnnouncementRepository) *AnnouncementHandler {
	return &AnnouncementHandler{Repo: repo}
}

func (h *AnnouncementHandler) GetStudentAnnouncements(c *gin.Context) {
	items, err := h.Repo.GetStudentAnnouncements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to load announcements",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
	})
}
