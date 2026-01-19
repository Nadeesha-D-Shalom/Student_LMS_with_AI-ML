package handlers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"github.com/gin-gonic/gin"
)

const (
	maxUploadSize = 20 << 20 // 20 MB
)

var allowedExtensions = map[string]string{
	".pdf":  "application/pdf",
	".doc":  "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".ppt":  "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

type TeacherMaterialHandler struct {
	Repo *teacherRepos.TeacherMaterialRepository
}

func NewTeacherMaterialHandler(r *teacherRepos.TeacherMaterialRepository) *TeacherMaterialHandler {
	return &TeacherMaterialHandler{Repo: r}
}

/*
POST /api/teacher/materials
Secure file upload with validation
*/
func (h *TeacherMaterialHandler) Upload(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	// ---------- Validate class_id ----------
	classIDStr := strings.TrimSpace(c.PostForm("class_id"))
	if classIDStr == "" {
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

	// ---------- Get file ----------
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file required"})
		return
	}

	if file.Size > maxUploadSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file too large"})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	expectedMime, ok := allowedExtensions[ext]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file type not allowed"})
		return
	}

	if !validateMimeType(file, expectedMime) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file content"})
		return
	}

	// ---------- Week title ----------
	weekTitle := strings.TrimSpace(c.PostForm("week_title"))
	if weekTitle == "" {
		weekTitle = "General"
	}

	// ---------- Prepare storage ----------
	baseDir := "uploads/materials"
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare upload directory"})
		return
	}

	name := strings.TrimSuffix(file.Filename, ext)
	safeName := sanitizeFilename(name)

	finalName := fmt.Sprintf(
		"class-%d_%d_%s%s",
		classID,
		time.Now().Unix(),
		safeName,
		ext,
	)

	fullPath := filepath.Join(baseDir, finalName)

	if err := c.SaveUploadedFile(file, fullPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	publicURL := "/uploads/materials/" + finalName

	materialType := "PDF"
	if ext == ".ppt" || ext == ".pptx" {
		materialType = "SLIDE"
	} else if ext == ".doc" || ext == ".docx" {
		materialType = "DOC"
	}

	if err := h.Repo.Create(
		classID,
		weekTitle,
		file.Filename,
		publicURL,
		materialType,
		teacherID,
	); err != nil {
		_ = os.Remove(fullPath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db insert failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "uploaded",
		"file_url": publicURL,
	})
}

/*
GET /api/teacher/materials
*/
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
Safe deletion (DB + filesystem)
*/
func (h *TeacherMaterialHandler) Delete(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	var materialID uint64
	if _, err := fmt.Sscan(c.Param("id"), &materialID); err != nil || materialID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	mat, err := h.Repo.GetByIDAndTeacher(materialID, teacherID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "not allowed"})
		return
	}

	if _, err := h.Repo.DeleteByTeacher(materialID, teacherID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	if strings.HasPrefix(mat.FileURL, "/uploads/materials/") {
		_ = os.Remove("." + mat.FileURL)
	}

	c.JSON(http.StatusOK, gin.H{"message": "material deleted"})
}

/*
PUT /api/teacher/materials/:id
*/
func (h *TeacherMaterialHandler) Update(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	var materialID uint64
	if _, err := fmt.Sscan(c.Param("id"), &materialID); err != nil || materialID == 0 {
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

// -------------------- helpers --------------------

func sanitizeFilename(name string) string {
	return strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') ||
			(r >= 'A' && r <= 'Z') ||
			(r >= '0' && r <= '9') ||
			r == '-' || r == '_' {
			return r
		}
		return '-'
	}, name)
}

func validateMimeType(file *multipart.FileHeader, expected string) bool {
	f, err := file.Open()
	if err != nil {
		return false
	}
	defer f.Close()

	buf := make([]byte, 512)
	if _, err := f.Read(buf); err != nil {
		return false
	}

	detected := http.DetectContentType(buf)
	return strings.HasPrefix(detected, expected)
}
