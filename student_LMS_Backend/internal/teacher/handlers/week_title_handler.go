package handlers

import (
	"net/http"
	"strings"

	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type WeekTitleHandler struct {
	Repo *teacherRepos.WeekTitleRepository
}

func NewWeekTitleHandler(r *teacherRepos.WeekTitleRepository) *WeekTitleHandler {
	return &WeekTitleHandler{Repo: r}
}

/*
PUT /api/teacher/weeks/rename

	{
	  "class_id": 7,
	  "old_week_title": "Week 1",
	  "new_week_title": "Week 1 (Jan 10 - Jan 16)"
	}
*/
func (h *WeekTitleHandler) Rename(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	var req struct {
		ClassID      uint64 `json:"class_id"`
		OldWeekTitle string `json:"old_week_title"`
		NewWeekTitle string `json:"new_week_title"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.OldWeekTitle = strings.TrimSpace(req.OldWeekTitle)
	req.NewWeekTitle = strings.TrimSpace(req.NewWeekTitle)

	if req.ClassID == 0 || req.OldWeekTitle == "" || req.NewWeekTitle == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "class_id, old_week_title, new_week_title are required"})
		return
	}

	owns, err := h.Repo.TeacherOwnsClass(teacherID, req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ownership check failed"})
		return
	}
	if !owns {
		c.JSON(http.StatusForbidden, gin.H{"error": "not allowed"})
		return
	}

	if err := h.Repo.RenameWeek(req.ClassID, req.OldWeekTitle, req.NewWeekTitle); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to rename week"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "week renamed"})
}
