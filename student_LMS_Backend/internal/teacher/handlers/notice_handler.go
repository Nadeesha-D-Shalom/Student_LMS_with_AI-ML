package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherNoticeHandler struct {
	Repo *repositories.TeacherNoticeRepository
}

func NewTeacherNoticeHandler(r *repositories.TeacherNoticeRepository) *TeacherNoticeHandler {
	return &TeacherNoticeHandler{Repo: r}
}

/*
POST /api/teacher/notices
*/
func (h *TeacherNoticeHandler) Create(c *gin.Context) {
	var req struct {
		ClassID uint64 `json:"class_id"`
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.Content = strings.TrimSpace(req.Content)
	if req.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "content required"})
		return
	}

	teacherID := c.GetUint64("user_id")

	if err := h.Repo.Create(
		teacherID,
		req.ClassID,
		req.Title,
		req.Content,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "create failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "notice created"})
}

/*
GET /api/teacher/notices
*/
func (h *TeacherNoticeHandler) List(c *gin.Context) {
	classID, _ := strconv.ParseUint(c.Query("class_id"), 10, 64)
	teacherID := c.GetUint64("user_id")

	items, err := h.Repo.GetByTeacher(teacherID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

/*
PUT /api/teacher/notices/:id
*/
func (h *TeacherNoticeHandler) Update(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	noticeID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || noticeID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req struct {
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.Content = strings.TrimSpace(req.Content)
	if req.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "content required"})
		return
	}

	if err := h.Repo.UpdateByTeacher(noticeID, teacherID, req.Content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "notice updated"})
}

/*
DELETE /api/teacher/notices/:id
*/
func (h *TeacherNoticeHandler) Delete(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	noticeID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || noticeID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	rows, err := h.Repo.DeleteByTeacher(noticeID, teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "notice deleted"})
}
