package repositories

import "database/sql"

type StudentNoticeRepository struct {
	DB *sql.DB
}

func NewStudentNoticeRepository(db *sql.DB) *StudentNoticeRepository {
	return &StudentNoticeRepository{DB: db}
}

func (r *StudentNoticeRepository) GetForStudent(studentID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT
			n.id,
			n.class_id,
			n.title,
			n.content,
			n.published_at
		FROM notices n
		LEFT JOIN student_classes sc ON sc.class_id = n.class_id
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

	items := make([]map[string]interface{}, 0)

	for rows.Next() {
		var id uint64
		var classID sql.NullInt64
		var title, content string
		var publishedAt string

		if err := rows.Scan(
			&id,
			&classID,
			&title,
			&content,
			&publishedAt,
		); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":           id,
			"class_id":     classID.Int64,
			"title":        title,
			"content":      content,
			"published_at": publishedAt,
		})
	}

	return items, nil
}
