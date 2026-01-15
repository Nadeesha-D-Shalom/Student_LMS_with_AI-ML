package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherClassHandler struct {
	Repo *repositories.TeacherClassRepository
}

func NewTeacherClassHandler(r *repositories.TeacherClassRepository) *TeacherClassHandler {
	return &TeacherClassHandler{Repo: r}
}

func (h *TeacherClassHandler) List(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	items, err := h.Repo.GetByTeacher(teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load classes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *TeacherClassHandler) Create(c *gin.Context) {
	var req struct {
		SubjectID uint64 `json:"subject_id"`
		Name      string `json:"name"`
		Location  string `json:"location"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	teacherID := c.GetUint64("user_id")

	if err := h.Repo.Create(teacherID, req.SubjectID, req.Name, req.Location); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create class"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Class created"})
}
