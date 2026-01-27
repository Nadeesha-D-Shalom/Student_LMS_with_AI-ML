package repositories

import "database/sql"

type TeacherAssignmentRepository struct {
	DB *sql.DB
}

func NewTeacherAssignmentRepository(db *sql.DB) *TeacherAssignmentRepository {
	return &TeacherAssignmentRepository{DB: db}
}

func (r *TeacherAssignmentRepository) Create(
	classID uint64,
	title string,
	description string,
	dueDate string,
	dueTime string,
	totalMarks int,
	allowLate bool,
	teacherID uint64,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO assignments
		(class_id, title, description, due_date, due_time, total_marks, allow_late, created_by)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`,
		classID,
		title,
		description,
		dueDate,
		dueTime,
		totalMarks,
		allowLate,
		teacherID,
	)

	return err
}

func (r *TeacherAssignmentRepository) ListByTeacher(teacherID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT 
			a.id,
			a.title,
			a.description,
			a.due_date,
			a.due_time,
			a.total_marks,
			a.is_active,
			c.class_name
		FROM assignments a
		JOIN classes c ON c.id = a.class_id
		WHERE a.created_by = ?
		ORDER BY a.created_at DESC
	`, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []map[string]interface{}

	for rows.Next() {
		var (
			id        uint64
			title     string
			desc      string
			dueDate   string
			dueTime   string
			marks     int
			isActive  bool
			className string
		)

		if err := rows.Scan(
			&id, &title, &desc, &dueDate, &dueTime, &marks, &isActive, &className,
		); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":          id,
			"title":       title,
			"description": desc,
			"due_date":    dueDate,
			"due_time":    dueTime,
			"total_marks": marks,
			"class_name":  className,
			"is_active":   isActive,
		})
	}

	return items, nil
}

func (r *TeacherAssignmentRepository) Update(
	id uint64,
	title string,
	description string,
	dueDate string,
	dueTime string,
	totalMarks int,
	allowLate bool,
) error {

	_, err := r.DB.Exec(`
		UPDATE assignments
		SET
			title = ?,
			description = ?,
			due_date = ?,
			due_time = ?,
			total_marks = ?,
			allow_late = ?
		WHERE id = ?
	`, title, description, dueDate, dueTime, totalMarks, allowLate, id)

	return err
}

func (r *TeacherAssignmentRepository) Delete(id uint64) error {
	_, err := r.DB.Exec(`
		DELETE FROM assignments
		WHERE id = ?
	`, id)
	return err
}
