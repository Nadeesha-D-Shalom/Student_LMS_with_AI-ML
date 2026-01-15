package repositories

import "database/sql"

type StaffNoticeRepository struct {
	DB *sql.DB
}

func NewStaffNoticeRepository(db *sql.DB) *StaffNoticeRepository {
	return &StaffNoticeRepository{DB: db}
}

func (r *StaffNoticeRepository) GetAll() ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, content, published_at, publisher_role
		FROM notices
		WHERE is_active = 1
		ORDER BY published_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]map[string]interface{}, 0)

	for rows.Next() {
		var id uint64
		var title, content, role, publishedAt string

		if err := rows.Scan(&id, &title, &content, &publishedAt, &role); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":            id,
			"title":         title,
			"content":       content,
			"published_at":  publishedAt,
			"publisherRole": role,
		})
	}

	return items, nil
}
