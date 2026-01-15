package repositories

import "database/sql"

type StudentWeekNoteRepository struct {
	DB *sql.DB
}

func NewStudentWeekNoteRepository(db *sql.DB) *StudentWeekNoteRepository {
	return &StudentWeekNoteRepository{DB: db}
}

func (r *StudentWeekNoteRepository) List(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT week_title, note
		FROM week_notes
		WHERE class_id = ?
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []map[string]interface{}{}

	for rows.Next() {
		var week, note string
		rows.Scan(&week, &note)

		items = append(items, map[string]interface{}{
			"week_title": week,
			"note":       note,
		})
	}

	return items, nil
}
