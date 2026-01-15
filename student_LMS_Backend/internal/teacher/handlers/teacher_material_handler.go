package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

type TeacherMaterialHandler struct {
	Repo *teacherRepos.TeacherMaterialRepository
}

func NewTeacherMaterialHandler(r *teacherRepos.TeacherMaterialRepository) *TeacherMaterialHandler {
	return &TeacherMaterialHandler{Repo: r}
}

func (h *TeacherMaterialHandler) Upload(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	classIDStr := c.PostForm("class_id")
	if strings.TrimSpace(classIDStr) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "class_id required"})
		return
	}

	var classID uint64
	if _, err := fmt.Sscan(classIDStr, &classID); err != nil || classID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class_id"})
		return
	}

	owns, err := h.Repo.TeacherOwnsClass(teacherID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ownership check failed"})
		return
	}
	if !owns {
		c.JSON(http.StatusForbidden, gin.H{"error": "not allowed"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file required"})
		return
	}

	weekTitle := strings.TrimSpace(c.PostForm("week_title"))
	if weekTitle == "" {
		weekTitle = "General"
	}

	baseDir := "./uploads/materials"
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create upload dir"})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	name := strings.TrimSuffix(file.Filename, ext)

	safe := strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') ||
			(r >= 'A' && r <= 'Z') ||
			(r >= '0' && r <= '9') ||
			r == '-' || r == '_' {
			return r
		}
		return '-'
	}, name)

	finalName := fmt.Sprintf(
		"class-%d_%d_%s%s",
		classID,
		time.Now().Unix(),
		safe,
		ext,
	)

	fullPath := filepath.Join(baseDir, finalName)
	if err := c.SaveUploadedFile(file, fullPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "save failed"})
		return
	}

	publicURL := "/uploads/materials/" + finalName

	materialType := "PDF"
	if ext == ".ppt" || ext == ".pptx" {
		materialType = "SLIDE"
	} else if ext == ".doc" || ext == ".docx" {
		materialType = "DOC"
	}

	title := file.Filename

	if err := h.Repo.Create(
		classID,
		weekTitle,
		title,
		publicURL,
		materialType,
		teacherID,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db insert failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "uploaded",
		"file_url": publicURL,
	})
}

func (h *TeacherMaterialHandler) List(c *gin.Context) {
	teacherID := c.GetUint64("user_id")
	classIDStr := c.Query("class_id")

	var classID uint64
	if _, err := fmt.Sscan(classIDStr, &classID); err != nil || classID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class_id"})
		return
	}

	items, err := h.Repo.ListByTeacherAndClass(teacherID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

/*
DELETE /api/teacher/materials/:id
Deletes material from DB and file system (ownership safe)
*/
func (h *TeacherMaterialHandler) Delete(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	idStr := c.Param("id")
	var materialID uint64
	if _, err := fmt.Sscan(idStr, &materialID); err != nil || materialID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// 1) Read file_url with ownership check
	mat, err := h.Repo.GetByIDAndTeacher(materialID, teacherID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "not allowed"})
		return
	}

	// 2) Delete DB row (ownership safe)
	affected, err := h.Repo.DeleteByTeacher(materialID, teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	// 3) Delete file from disk
	if mat.FileURL != "" {
		_ = os.Remove("." + mat.FileURL)
	}

	c.JSON(http.StatusOK, gin.H{"message": "material deleted"})
}

/*
PUT /api/teacher/materials/:id

	{
	  "title": "new name.pdf",
	  "week_title": "Week 1 (Jan 10 - Jan 16)"
	}
*/
func (h *TeacherMaterialHandler) Update(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	idStr := c.Param("id")
	var materialID uint64
	if _, err := fmt.Sscan(idStr, &materialID); err != nil || materialID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req struct {
		Title     string `json:"title"`
		WeekTitle string `json:"week_title"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.Title = strings.TrimSpace(req.Title)
	req.WeekTitle = strings.TrimSpace(req.WeekTitle)

	if req.Title == "" && req.WeekTitle == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing to update"})
		return
	}

	if err := h.Repo.UpdateMetaByTeacher(materialID, teacherID, req.Title, req.WeekTitle); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "material updated"})
}
