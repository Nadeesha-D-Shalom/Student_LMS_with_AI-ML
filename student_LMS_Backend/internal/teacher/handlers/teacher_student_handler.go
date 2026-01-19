package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherStudentHandler struct {
	Repo *repositories.TeacherStudentRepository
}

func NewTeacherStudentHandler(r *repositories.TeacherStudentRepository) *TeacherStudentHandler {
	return &TeacherStudentHandler{Repo: r}
}

func (h *TeacherStudentHandler) List(c *gin.Context) {
	items, err := h.Repo.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load students"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *TeacherStudentHandler) Get(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	item, err := h.Repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
		return
	}

	c.JSON(http.StatusOK, item)
}
