package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"student_LMS_Backend/internal/student/models"
	"student_LMS_Backend/internal/student/repositories"
)

type AnnouncementHandler struct {
	Repo *repositories.AnnouncementRepository
}

func NewAnnouncementHandler(repo *repositories.AnnouncementRepository) *AnnouncementHandler {
	return &AnnouncementHandler{Repo: repo}
}

/* -------- STUDENT READ -------- */

func (h *AnnouncementHandler) GetStudentAnnouncements(c *gin.Context) {
	items, err := h.Repo.GetStudentAnnouncements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load announcements"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

/* -------- ADMIN / TEACHER READ -------- */

func (h *AnnouncementHandler) GetAllAnnouncements(c *gin.Context) {
	items, err := h.Repo.GetAllAnnouncements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load announcements"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

/* -------- CREATE -------- */

func (h *AnnouncementHandler) CreateAnnouncement(c *gin.Context) {
	var req models.CreateAnnouncementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userID := c.GetUint64("user_id")

	if err := h.Repo.Create(req.Title, req.Message, req.TargetRole, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create announcement"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Announcement created"})
}

/* -------- UPDATE -------- */

func (h *AnnouncementHandler) UpdateAnnouncement(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	var req models.UpdateAnnouncementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.Repo.Update(id, req.Title, req.Message, req.TargetRole, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update announcement"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement updated"})
}

/* -------- DELETE -------- */

func (h *AnnouncementHandler) DeleteAnnouncement(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	if err := h.Repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete announcement"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement deleted"})
}
