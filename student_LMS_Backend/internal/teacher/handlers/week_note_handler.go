package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type WeekNoteHandler struct {
	Repo *repositories.WeekNoteRepository
}

func NewWeekNoteHandler(r *repositories.WeekNoteRepository) *WeekNoteHandler {
	return &WeekNoteHandler{Repo: r}
}

func (h *WeekNoteHandler) List(c *gin.Context) {
	classID, _ := strconv.ParseUint(c.Query("class_id"), 10, 64)

	items, err := h.Repo.List(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *WeekNoteHandler) Upsert(c *gin.Context) {
	var req struct {
		ClassID   uint64 `json:"class_id"`
		WeekTitle string `json:"week_title"`
		Note      string `json:"note"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	teacherID := c.GetUint64("user_id")

	if err := h.Repo.Upsert(
		req.ClassID,
		req.WeekTitle,
		req.Note,
		teacherID,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "save failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "saved"})
}

func (h *WeekNoteHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	if err := h.Repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
