package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type StudentWeekNoteHandler struct {
	Repo *repositories.StudentWeekNoteRepository
}

func NewStudentWeekNoteHandler(r *repositories.StudentWeekNoteRepository) *StudentWeekNoteHandler {
	return &StudentWeekNoteHandler{Repo: r}
}

/*
GET /api/student/weeks/notes?class_id=7
*/
func (h *StudentWeekNoteHandler) List(c *gin.Context) {
	classID, _ := strconv.ParseUint(c.Query("class_id"), 10, 64)
	if classID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "class_id is required"})
		return
	}

	items, err := h.Repo.List(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load week notes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
