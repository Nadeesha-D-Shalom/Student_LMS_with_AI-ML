package handlers

import (
	"net/http"
	"strconv"
	"student_LMS_Backend/internal/database"

	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherAssignmentHandler struct {
	Repo *repositories.TeacherAssignmentRepository
}

func NewTeacherAssignmentHandler(r *repositories.TeacherAssignmentRepository) *TeacherAssignmentHandler {
	return &TeacherAssignmentHandler{Repo: r}
}

func (h *TeacherAssignmentHandler) Create(c *gin.Context) {
	var req struct {
		ClassID     uint64 `json:"class_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		DueDate     string `json:"due_date"`
		DueTime     string `json:"due_time"`
		TotalMarks  int    `json:"total_marks"`
		AllowLate   bool   `json:"allow_late"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	teacherID := c.GetUint64("user_id")

	if err := h.Repo.Create(
		req.ClassID,
		req.Title,
		req.Description,
		req.DueDate,
		req.DueTime,
		req.TotalMarks,
		req.AllowLate,
		teacherID,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "create failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "created"})
}

func (h *TeacherAssignmentHandler) List(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	items, err := h.Repo.ListByTeacher(teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *TeacherAssignmentHandler) Update(c *gin.Context) {
	idParam := c.Param("assignmentId")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var body struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		DueDate     string `json:"due_date"`
		DueTime     string `json:"due_time"`
		TotalMarks  int    `json:"total_marks"`
		AllowLate   bool   `json:"allow_late"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	if err := h.Repo.Update(
		id,
		body.Title,
		body.Description,
		body.DueDate,
		body.DueTime,
		body.TotalMarks,
		body.AllowLate,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *TeacherAssignmentHandler) Delete(c *gin.Context) {
	idParam := c.Param("assignmentId")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.Repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func ToggleAssignmentStatus(c *gin.Context) {
	assignmentID := c.Param("assignmentId")

	var payload struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	_, err := database.DB.Exec(`
		UPDATE assignments
		SET is_active = ?
		WHERE id = ?
	`, payload.IsActive, assignmentID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update assignment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
