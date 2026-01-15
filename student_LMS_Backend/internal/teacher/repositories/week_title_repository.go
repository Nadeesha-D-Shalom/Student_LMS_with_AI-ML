package repositories

import "database/sql"

type WeekTitleRepository struct {
	DB *sql.DB
}

func NewWeekTitleRepository(db *sql.DB) *WeekTitleRepository {
	return &WeekTitleRepository{DB: db}
}

func (r *WeekTitleRepository) TeacherOwnsClass(teacherID, classID uint64) (bool, error) {
	var count int
	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM classes
		WHERE id = ? AND teacher_id = ?
	`, classID, teacherID).Scan(&count)
	return count > 0, err
}

// Rename week in BOTH study_materials + week_notes
func (r *WeekTitleRepository) RenameWeek(
	classID uint64,
	oldTitle string,
	newTitle string,
) error {

	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	// study_materials
	if _, err := tx.Exec(`
		UPDATE study_materials
		SET week_title = ?
		WHERE class_id = ? AND week_title = ?
	`, newTitle, classID, oldTitle); err != nil {
		return err
	}

	// week_notes
	if _, err := tx.Exec(`
		UPDATE week_notes
		SET week_title = ?
		WHERE class_id = ? AND week_title = ?
	`, newTitle, classID, oldTitle); err != nil {
		return err
	}

	return tx.Commit()
}
