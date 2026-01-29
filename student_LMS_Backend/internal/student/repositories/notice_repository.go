package repositories

import (
	"database/sql"
	"time"
)

type StudentNoticeRepository struct {
	DB *sql.DB
}

func NewStudentNoticeRepository(db *sql.DB) *StudentNoticeRepository {
	return &StudentNoticeRepository{DB: db}
}

func (r *StudentNoticeRepository) GetForStudent(
	studentID uint64,
) ([]map[string]interface{}, error) {

	rows, err := r.DB.Query(`
		SELECT
			n.id,
			n.class_id,
			n.title,
			n.content,
			n.published_at,
			u.full_name AS teacher_name
		FROM notices n
		LEFT JOIN student_classes sc
			ON sc.class_id = n.class_id
		LEFT JOIN users u
			ON u.id = n.published_by
			AND u.role = 'TEACHER'
		WHERE
			n.is_active = 1
			AND n.target_role IN ('STUDENT','ALL')
			AND (
				n.class_id IS NULL
				OR sc.student_id = ?
			)
		ORDER BY n.published_at DESC
	`, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []map[string]interface{}{}

	for rows.Next() {
		var (
			id          uint64
			classID     sql.NullInt64
			title       string
			content     string
			publishedAt time.Time
			teacherName sql.NullString
		)

		if err := rows.Scan(
			&id,
			&classID,
			&title,
			&content,
			&publishedAt,
			&teacherName,
		); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":           id,
			"class_id":     classID.Int64,
			"title":        title,
			"content":      content,
			"published_at": publishedAt,
			"teacher_name": teacherName.String,
		})
	}

	return items, nil
}
