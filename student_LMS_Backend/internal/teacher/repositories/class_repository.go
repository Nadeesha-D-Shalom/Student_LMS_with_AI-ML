package repositories

import "database/sql"

type TeacherClassRepository struct {
	DB *sql.DB
}

func NewTeacherClassRepository(db *sql.DB) *TeacherClassRepository {
	return &TeacherClassRepository{DB: db}
}

func (r *TeacherClassRepository) GetByTeacher(teacherID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT 
			c.id,
			c.class_name,
			c.institute_location,
			s.name AS subject,
			s.grade
		FROM classes c
		JOIN subjects s ON s.id = c.subject_id
		WHERE c.teacher_id = ?
		ORDER BY c.created_at DESC
	`, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]map[string]interface{}, 0) // FIX

	for rows.Next() {
		var id uint64
		var name, location, subject, grade string

		if err := rows.Scan(&id, &name, &location, &subject, &grade); err != nil {
			return nil, err
		}

		result = append(result, map[string]interface{}{
			"id":       id,
			"name":     name,
			"location": location,
			"subject":  subject,
			"grade":    grade,
		})
	}

	return result, nil
}

func (r *TeacherClassRepository) Create(
	teacherID, subjectID uint64,
	className, location string,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO classes (subject_id, teacher_id, class_name, institute_location)
		VALUES (?, ?, ?, ?)
	`, subjectID, teacherID, className, location)

	return err
}
