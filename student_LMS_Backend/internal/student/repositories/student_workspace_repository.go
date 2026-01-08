package repositories

import (
	"database/sql"

	"student_LMS_Backend/internal/database"
)

type StudentWorkspaceRepository struct {
	DB *sql.DB
}

func NewStudentWorkspaceRepository() *StudentWorkspaceRepository {
	return &StudentWorkspaceRepository{
		DB: database.DB,
	}
}
func (r *StudentWorkspaceRepository) IsStudentEnrolled(studentID, classID uint64) (bool, error) {
	var count int
	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM student_classes
		WHERE student_id = ? AND class_id = ?
	`, studentID, classID).Scan(&count)

	return count > 0, err
}
func (r *StudentWorkspaceRepository) GetNotices(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, content, published_at
		FROM notices
		WHERE class_id = ?
		  AND is_active = 1
		  AND (expires_at IS NULL OR expires_at > NOW())
		ORDER BY published_at DESC
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}
	for rows.Next() {
		var id uint64
		var title, content string
		var publishedAt string

		if err := rows.Scan(&id, &title, &content, &publishedAt); err != nil {
			return nil, err
		}

		result = append(result, map[string]interface{}{
			"id":           id,
			"title":        title,
			"content":      content,
			"published_at": publishedAt,
		})
	}

	return result, nil
}
func (r *StudentWorkspaceRepository) GetMaterials(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, file_url, material_type, uploaded_at
		FROM study_materials
		WHERE class_id = ?
		ORDER BY uploaded_at DESC
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}
	for rows.Next() {
		var id uint64
		var title, fileURL, materialType, uploadedAt string

		if err := rows.Scan(&id, &title, &fileURL, &materialType, &uploadedAt); err != nil {
			return nil, err
		}

		result = append(result, map[string]interface{}{
			"id":            id,
			"title":         title,
			"file_url":      fileURL,
			"material_type": materialType,
			"uploaded_at":   uploadedAt,
		})
	}

	return result, nil
}
func (r *StudentWorkspaceRepository) GetAssignments(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, due_date, due_time, total_marks, created_at
		FROM assignments
		WHERE class_id = ?
		ORDER BY created_at DESC
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}
	for rows.Next() {
		var id uint64
		var title, dueDate, dueTime, createdAt string
		var totalMarks int

		if err := rows.Scan(&id, &title, &dueDate, &dueTime, &totalMarks, &createdAt); err != nil {
			return nil, err
		}

		result = append(result, map[string]interface{}{
			"id":          id,
			"title":       title,
			"due_date":    dueDate,
			"due_time":    dueTime,
			"total_marks": totalMarks,
			"created_at":  createdAt,
		})
	}

	return result, nil
}
