package handlers

import (
	"net/http"
	"time"

	"student_LMS_Backend/internal/database"

	"github.com/gin-gonic/gin"
)

func TeacherDashboard(c *gin.Context) {
	teacherID := c.GetUint64("user_id")

	var (
		totalClasses      int
		totalStudents     int
		activeAssignments int
	)

	// ---------- TOTAL CLASSES ----------
	if err := database.DB.QueryRow(`
		SELECT COUNT(*)
		FROM classes
		WHERE teacher_id = ?
	`, teacherID).Scan(&totalClasses); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load classes"})
		return
	}

	// ---------- TOTAL STUDENTS ----------
	if err := database.DB.QueryRow(`
		SELECT COUNT(DISTINCT sc.student_id)
		FROM student_classes sc
		INNER JOIN classes c ON c.id = sc.class_id
		WHERE c.teacher_id = ?
	`, teacherID).Scan(&totalStudents); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load students"})
		return
	}

	// ---------- ACTIVE ASSIGNMENTS ----------
	if err := database.DB.QueryRow(`
		SELECT COUNT(*)
		FROM assignments
		WHERE is_active = 1
		  AND created_by = ?
	`, teacherID).Scan(&activeAssignments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load assignments"})
		return
	}

	// ---------- RECENT NOTICES ----------
	rows, err := database.DB.Query(`
		SELECT
			n.id,
			COALESCE(NULLIF(n.title, ''), 'Announcement') AS title,
			n.content,
			n.target_role,
			n.published_at,
			IFNULL(CONCAT('Class #', n.class_id), 'All Classes') AS class_name
		FROM notices n
		WHERE n.published_by = ?
		  AND n.publisher_role = 'TEACHER'
		  AND n.is_active = 1
		ORDER BY n.published_at DESC
		LIMIT 5
	`, teacherID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load notices"})
		return
	}
	defer rows.Close()

	notices := make([]gin.H, 0)

	for rows.Next() {
		var (
			id          uint64
			title       string
			content     string
			targetRole  string
			className   string
			publishedAt time.Time
		)

		if err := rows.Scan(
			&id,
			&title,
			&content,
			&targetRole,
			&publishedAt,
			&className,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse notices"})
			return
		}

		notices = append(notices, gin.H{
			"id":           id,
			"title":        title,
			"content":      content,
			"class_name":   className,
			"target_role":  targetRole,
			"published_at": publishedAt.Format("2006-01-02 15:04:05"),
		})
	}

	// ---------- RESPONSE ----------
	c.JSON(http.StatusOK, gin.H{
		"total_classes":      totalClasses,
		"total_students":     totalStudents,
		"active_assignments": activeAssignments,
		"recent_notices":     notices,
	})
}
