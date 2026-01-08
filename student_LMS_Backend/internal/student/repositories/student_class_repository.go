package repositories

import "database/sql"

type StudentClassRepository struct {
	DB *sql.DB
}

func NewStudentClassRepository(db *sql.DB) *StudentClassRepository {
	return &StudentClassRepository{DB: db}
}

func (r *StudentClassRepository) StudentInClass(studentID, classID uint64) (bool, error) {
	var exists int
	err := r.DB.QueryRow(`
		SELECT 1
		FROM student_classes
		WHERE student_id = ? AND class_id = ?
		LIMIT 1
	`, studentID, classID).Scan(&exists)

	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return true, nil
}
