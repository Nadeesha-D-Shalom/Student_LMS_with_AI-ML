package repositories

import "database/sql"

type WeekNoteRepository struct {
	DB *sql.DB
}

func NewWeekNoteRepository(db *sql.DB) *WeekNoteRepository {
	return &WeekNoteRepository{DB: db}
}

func (r *WeekNoteRepository) List(classID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT id, week_title, note
		FROM week_notes
		WHERE class_id = ?
	`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []map[string]interface{}{}

	for rows.Next() {
		var id uint64
		var weekTitle, note string

		if err := rows.Scan(&id, &weekTitle, &note); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":         id,
			"week_title": weekTitle,
			"note":       note,
		})
	}

	return items, nil
}

func (r *WeekNoteRepository) Upsert(
	classID uint64,
	weekTitle string,
	note string,
	teacherID uint64,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO week_notes (class_id, week_title, note, created_by)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE note = VALUES(note)
	`, classID, weekTitle, note, teacherID)
	return err
}

func (r *WeekNoteRepository) Delete(id uint64) error {
	_, err := r.DB.Exec(`DELETE FROM week_notes WHERE id = ?`, id)
	return err
}
