package repositories

import "database/sql"

type StudentResultItem struct {
	ID          uint64 `json:"id"`
	Type        string `json:"type"` // TEST | ASSIGNMENT
	Subject     string `json:"subject"`
	Title       string `json:"test_title"`
	Score       int    `json:"score"`
	TotalMarks  int    `json:"total_marks"`
	SubmittedAt string `json:"submitted_at"`
}

type StudentResultsRepository struct {
	DB *sql.DB
}

func NewStudentResultsRepository(db *sql.DB) *StudentResultsRepository {
	return &StudentResultsRepository{DB: db}
}

func (r *StudentResultsRepository) List(studentID uint64) ([]StudentResultItem, error) {
	rows, err := r.DB.Query(`
		SELECT
			a.id,
			'TEST' AS type,
			s.name AS subject,
			t.title,
			a.score,
			t.total_marks,
			a.submitted_at
		FROM student_test_attempts a
		JOIN tests t ON t.id = a.test_id
		JOIN classes c ON c.id = t.class_id
		JOIN subjects s ON s.id = c.subject_id
		WHERE a.student_id = ?
		  AND a.status = 'SUBMITTED'
		  AND t.show_results = 1
		ORDER BY a.submitted_at DESC
	`, studentID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []StudentResultItem
	for rows.Next() {
		var rItem StudentResultItem
		if err := rows.Scan(
			&rItem.ID,
			&rItem.Type,
			&rItem.Subject,
			&rItem.Title,
			&rItem.Score,
			&rItem.TotalMarks,
			&rItem.SubmittedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, rItem)
	}

	return list, nil
}
