package repositories

import (
	"database/sql"

	"student_LMS_Backend/internal/database"
)

type StudentAssignmentRepository struct {
	DB *sql.DB
}

func NewStudentAssignmentRepository() *StudentAssignmentRepository {
	return &StudentAssignmentRepository{
		DB: database.DB,
	}
}

func (r *StudentAssignmentRepository) FetchStudentAssignments(
	studentID uint64,
	classID *uint64,
) ([]map[string]interface{}, error) {

	baseQuery := `
		SELECT
			a.id,
			a.title,
			a.due_date,
			a.due_time,
			c.class_name,
			IF(s.assignment_id IS NULL, 'PENDING', 'SUBMITTED') AS status
		FROM assignments a
		JOIN classes c ON c.id = a.class_id
		JOIN student_classes sc ON sc.class_id = c.id
		LEFT JOIN assignment_submissions s
			ON s.assignment_id = a.id
			AND s.student_id = ?
		WHERE sc.student_id = ?
		  AND a.is_active = 1
	`

	args := []interface{}{studentID, studentID}

	if classID != nil {
		baseQuery += " AND a.class_id = ? "
		args = append(args, *classID)
	}

	baseQuery += " ORDER BY a.due_date ASC "

	rows, err := r.DB.Query(baseQuery, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []map[string]interface{}

	for rows.Next() {
		var (
			id        uint64
			title     string
			dueDate   string
			dueTime   string
			className string
			status    string
		)

		if err := rows.Scan(
			&id,
			&title,
			&dueDate,
			&dueTime,
			&className,
			&status,
		); err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":         id,
			"title":      title,
			"due_date":   dueDate,
			"due_time":   dueTime,
			"class_name": className,
			"status":     status,
		})
	}

	return items, nil
}

func (r *StudentAssignmentRepository) CanAccessAssignment(studentID, assignmentID uint64) (bool, error) {
	var count int

	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM assignments a
		JOIN student_classes sc ON sc.class_id = a.class_id
		WHERE a.id = ?
		  AND sc.student_id = ?
		  AND a.is_active = 1
	`, assignmentID, studentID).Scan(&count)

	return count > 0, err
}

func (r *StudentAssignmentRepository) FetchAssignmentDetail(
	studentID, assignmentID uint64,
) (map[string]interface{}, error) {

	var (
		title       string
		description sql.NullString
		dueDate     string
		dueTime     string
		totalMarks  int
	)

	err := r.DB.QueryRow(`
		SELECT title, description, due_date, due_time, total_marks
		FROM assignments
		WHERE id = ? AND is_active = 1
	`, assignmentID).Scan(
		&title,
		&description,
		&dueDate,
		&dueTime,
		&totalMarks,
	)

	if err != nil {
		return nil, err
	}

	data := map[string]interface{}{
		"title":       title,
		"due_date":    dueDate,
		"due_time":    dueTime,
		"total_marks": totalMarks,
	}

	if description.Valid {
		data["description"] = description.String
	} else {
		data["description"] = ""
	}

	var submissionURL sql.NullString
	var submittedAt sql.NullTime

	err = r.DB.QueryRow(`
		SELECT submission_url, submitted_at
		FROM assignment_submissions
		WHERE assignment_id = ? AND student_id = ?
	`, assignmentID, studentID).Scan(&submissionURL, &submittedAt)

	if err == nil && submissionURL.Valid {
		data["status"] = "SUBMITTED"
		data["submission_url"] = submissionURL.String
		if submittedAt.Valid {
			data["submitted_at"] = submittedAt.Time.Format("2006-01-02 15:04:05")
		} else {
			data["submitted_at"] = ""
		}
	} else {
		data["status"] = "PENDING"
		data["submission_url"] = ""
		data["submitted_at"] = ""
	}

	return data, nil
}

func (r *StudentAssignmentRepository) SaveSubmission(
	studentID, assignmentID uint64,
	path string,
) error {

	_, err := r.DB.Exec(`
		INSERT INTO assignment_submissions
			(assignment_id, student_id, submission_url, submitted_at)
		VALUES (?, ?, ?, CURRENT_TIMESTAMP)
		ON DUPLICATE KEY UPDATE
			submission_url = VALUES(submission_url),
			submitted_at = CURRENT_TIMESTAMP
	`, assignmentID, studentID, path)

	return err
}

func DeleteSubmission(studentID, assignmentID uint64) error {
	_, err := database.DB.Exec(`
		DELETE FROM assignment_submissions
		WHERE assignment_id = ? AND student_id = ?
	`, assignmentID, studentID)

	return err
}

func (r *StudentAssignmentRepository) GetAssignmentDeadline(
	assignmentID uint64,
) (dueDate string, dueTime string, allowLate bool, err error) {

	err = r.DB.QueryRow(`
		SELECT due_date, due_time, allow_late
		FROM assignments
		WHERE id = ? AND is_active = 1
	`, assignmentID).Scan(&dueDate, &dueTime, &allowLate)

	return
}
