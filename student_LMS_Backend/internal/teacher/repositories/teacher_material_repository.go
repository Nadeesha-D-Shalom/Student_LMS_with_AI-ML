package repositories

import (
	"database/sql"
	"time"
)

type TeacherMaterialRepository struct {
	DB *sql.DB
}

func NewTeacherMaterialRepository(db *sql.DB) *TeacherMaterialRepository {
	return &TeacherMaterialRepository{DB: db}
}

// Ensures teacher is the owner of the class
func (r *TeacherMaterialRepository) TeacherOwnsClass(teacherID, classID uint64) (bool, error) {
	var count int
	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM classes
		WHERE id = ? AND teacher_id = ?
	`, classID, teacherID).Scan(&count)

	return count > 0, err
}

func (r *TeacherMaterialRepository) Create(
	classID uint64,
	weekTitle string,
	title string,
	fileURL string,
	materialType string,
	uploadedBy uint64,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO study_materials (class_id, week_title, title, file_url, material_type, uploaded_by)
		VALUES (?, ?, ?, ?, ?, ?)
	`, classID, weekTitle, title, fileURL, materialType, uploadedBy)
	return err
}

func (r *TeacherMaterialRepository) ListByTeacherAndClass(
	teacherID uint64,
	classID uint64,
) ([]map[string]interface{}, error) {

	rows, err := r.DB.Query(`
		SELECT
			sm.id,
			sm.class_id,
			sm.week_title,
			sm.title,
			sm.file_url,
			sm.material_type,
			sm.uploaded_at
		FROM study_materials sm
		JOIN classes c ON c.id = sm.class_id
		WHERE c.teacher_id = ?
		  AND sm.class_id = ?
		ORDER BY sm.uploaded_at DESC
	`, teacherID, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]map[string]interface{}, 0)

	for rows.Next() {
		var id uint64
		var cid uint64
		var weekTitle sql.NullString
		var title sql.NullString
		var fileURL sql.NullString
		var materialType sql.NullString
		var uploadedAt time.Time

		if err := rows.Scan(&id, &cid, &weekTitle, &title, &fileURL, &materialType, &uploadedAt); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":            id,
			"class_id":      cid,
			"week_title":    weekTitle.String,
			"title":         title.String,
			"file_url":      fileURL.String,
			"material_type": materialType.String,
			"uploaded_at":   uploadedAt,
		})
	}

	return items, nil
}

type MaterialFile struct {
	ID      uint64
	FileURL string
}

// Ownership-safe: only returns if teacher owns this material via class ownership
func (r *TeacherMaterialRepository) GetByIDAndTeacher(
	id uint64,
	teacherID uint64,
) (*MaterialFile, error) {

	var fileURL string

	err := r.DB.QueryRow(`
		SELECT sm.file_url
		FROM study_materials sm
		JOIN classes c ON c.id = sm.class_id
		WHERE sm.id = ? AND c.teacher_id = ?
	`, id, teacherID).Scan(&fileURL)

	if err != nil {
		return nil, err
	}

	return &MaterialFile{
		ID:      id,
		FileURL: fileURL,
	}, nil
}

// Ownership-safe delete: deletes only if teacher owns it
func (r *TeacherMaterialRepository) DeleteByTeacher(
	id uint64,
	teacherID uint64,
) (int64, error) {

	res, err := r.DB.Exec(`
		DELETE sm
		FROM study_materials sm
		JOIN classes c ON c.id = sm.class_id
		WHERE sm.id = ? AND c.teacher_id = ?
	`, id, teacherID)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (r *TeacherMaterialRepository) UpdateMetaByTeacher(
	id uint64,
	teacherID uint64,
	newTitle string,
	newWeekTitle string,
) error {
	// Ownership enforced by joining classes
	_, err := r.DB.Exec(`
		UPDATE study_materials sm
		JOIN classes c ON c.id = sm.class_id
		SET sm.title = COALESCE(NULLIF(?, ''), sm.title),
		    sm.week_title = COALESCE(NULLIF(?, ''), sm.week_title)
		WHERE sm.id = ? AND c.teacher_id = ?
	`, newTitle, newWeekTitle, id, teacherID)
	return err
}
