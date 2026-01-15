package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/student/repositories"

	"github.com/gin-gonic/gin"
)

type StudentMaterialHandler struct {
	Repo *repositories.StudentMaterialRepository
}

func NewStudentMaterialHandler(r *repositories.StudentMaterialRepository) *StudentMaterialHandler {
	return &StudentMaterialHandler{Repo: r}
}

func (h *StudentMaterialHandler) List(c *gin.Context) {
	classID, err := strconv.ParseUint(c.Query("class_id"), 10, 64)
	if err != nil || classID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "class_id required"})
		return
	}

	items, err := h.Repo.GetByClass(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
