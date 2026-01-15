package repositories

import (
	"database/sql"
)

type TeacherNoticeRepository struct {
	DB *sql.DB
}

func NewTeacherNoticeRepository(db *sql.DB) *TeacherNoticeRepository {
	return &TeacherNoticeRepository{DB: db}
}

func (r *TeacherNoticeRepository) Create(
	teacherID uint64,
	classID uint64,
	title string,
	content string,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO notices
			(title, content, published_by, publisher_role, target_role, class_id)
		VALUES
			(?, ?, ?, 'TEACHER', 'STUDENT', ?)
	`, title, content, teacherID, classID)

	return err
}

func (r *TeacherNoticeRepository) GetByTeacher(
	teacherID uint64,
	classID uint64,
) ([]map[string]interface{}, error) {

	rows, err := r.DB.Query(`
		SELECT id, title, content, published_at, class_id
		FROM notices
		WHERE published_by = ?
		  AND class_id = ?
		  AND publisher_role = 'TEACHER'
		  AND is_active = 1
		ORDER BY published_at DESC
	`, teacherID, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]map[string]interface{}, 0)

	for rows.Next() {
		var id uint64
		var title, content, publishedAt string
		var cid uint64

		if err := rows.Scan(&id, &title, &content, &publishedAt, &cid); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":           id,
			"title":        title,
			"content":      content,
			"published_at": publishedAt,
			"class_id":     cid,
		})
	}

	return items, nil
}

/*
DELETE notice (teacher-owned)
Returns affected rows count
*/
func (r *TeacherNoticeRepository) DeleteByTeacher(
	noticeID uint64,
	teacherID uint64,
) (int64, error) {

	res, err := r.DB.Exec(`
		DELETE FROM notices
		WHERE id = ? AND published_by = ? AND publisher_role = 'TEACHER'
	`, noticeID, teacherID)

	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (r *TeacherNoticeRepository) UpdateByTeacher(
	noticeID uint64,
	teacherID uint64,
	content string,
) error {

	_, err := r.DB.Exec(`
		UPDATE notices
		SET content = ?
		WHERE id = ?
		  AND published_by = ?
		  AND publisher_role = 'TEACHER'
	`, content, noticeID, teacherID)

	return err
}
