package repositories

import "database/sql"

type StudentMaterialRepository struct {
	DB *sql.DB
}

func NewStudentMaterialRepository(db *sql.DB) *StudentMaterialRepository {
	return &StudentMaterialRepository{DB: db}
}

func (r *StudentMaterialRepository) GetByClass(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT
			id,
			week_title,
			title,
			file_url
		FROM study_materials
		WHERE class_id = ?
		ORDER BY uploaded_at DESC
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []map[string]interface{}{}

	for rows.Next() {
		var id uint64
		var week, title, fileURL string

		if err := rows.Scan(&id, &week, &title, &fileURL); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":         id,
			"week_title": week,
			"title":      title,
			"file_url":   fileURL,
		})
	}

	return items, nil
}
