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

/* ===============================
   LIST ALL ASSIGNMENTS (STUDENT)
================================ */

func (r *StudentAssignmentRepository) FetchStudentAssignments(studentID uint64) ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
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
	ORDER BY a.due_date ASC
`, studentID, studentID)

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

/* ===============================
   ACCESS CHECK
================================ */

func (r *StudentAssignmentRepository) CanAccessAssignment(studentID, assignmentID uint64) (bool, error) {
	var count int

	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM assignments a
		JOIN student_classes sc ON sc.class_id = a.class_id
		WHERE a.id = ? AND sc.student_id = ?
	`, assignmentID, studentID).Scan(&count)

	return count > 0, err
}

/* ===============================
   ASSIGNMENT DETAIL (FIXED)
================================ */

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
		WHERE id = ?
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

	/* ===== Submission status ===== */

	var submissionURL sql.NullString

	err = r.DB.QueryRow(`
		SELECT submission_url
		FROM assignment_submissions
		WHERE assignment_id = ? AND student_id = ?
	`, assignmentID, studentID).Scan(&submissionURL)

	if err == nil && submissionURL.Valid {
		data["status"] = "SUBMITTED"
		data["submission_url"] = submissionURL.String
	} else {
		data["status"] = "PENDING"
	}

	return data, nil
}

/* ===============================
   SUBMIT ASSIGNMENT
================================ */

func (r *StudentAssignmentRepository) SaveSubmission(
	studentID, assignmentID uint64,
	url string,
) error {

	_, err := r.DB.Exec(`
		INSERT INTO assignment_submissions
			(assignment_id, student_id, submission_url)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE
			submission_url = VALUES(submission_url)
	`, assignmentID, studentID, url)

	return err
}
func SaveSubmissionFile(assignmentID, studentID uint64, path string) error {
	_, err := database.DB.Exec(`
		INSERT INTO assignment_submissions (assignment_id, student_id, submission_url)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE
			submission_url = VALUES(submission_url),
			submitted_at = CURRENT_TIMESTAMP
	`, assignmentID, studentID, path)

	return err
}
