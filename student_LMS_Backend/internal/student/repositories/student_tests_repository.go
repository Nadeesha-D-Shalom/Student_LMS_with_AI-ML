package repositories

import (
	"database/sql"
	"errors"
	"time"

	"student_LMS_Backend/internal/database"
)

type StudentTestsRepository struct {
	DB *sql.DB
}

func NewStudentTestsRepository() *StudentTestsRepository {
	return &StudentTestsRepository{DB: database.DB}
}

type TestListItem struct {
	ID              uint64    `json:"id"`
	ClassID         uint64    `json:"class_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	DurationMinutes int       `json:"duration_minutes"`
	TotalMarks      int       `json:"total_marks"`
	StartAt         time.Time `json:"start_at"`
	EndAt           time.Time `json:"end_at"`
	ShowResults     bool      `json:"show_results"`

	AttemptStatus string `json:"attempt_status"`
	Score         int    `json:"score"`
}

type TestDetail struct {
	ID              uint64    `json:"id"`
	ClassID         uint64    `json:"class_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	DurationMinutes int       `json:"duration_minutes"`
	TotalMarks      int       `json:"total_marks"`
	StartAt         time.Time `json:"start_at"`
	EndAt           time.Time `json:"end_at"`
	ShowResults     bool      `json:"show_results"`

	AttemptStatus string     `json:"attempt_status"`
	StartedAt     *time.Time `json:"started_at"`
	SubmittedAt   *time.Time `json:"submitted_at"`
	Score         int        `json:"score"`
}

type StudentQuestion struct {
	ID       uint64 `json:"id"`
	Question string `json:"question"`

	OptionA string `json:"option_a"`
	OptionB string `json:"option_b"`
	OptionC string `json:"option_c"`
	OptionD string `json:"option_d"`

	Marks int `json:"marks"`

	// Future support (written):
	// QuestionType string `json:"question_type"` // "MCQ" | "WRITTEN"
	// ExpectedAnswer string `json:"expected_answer"`
}

type AttemptInfo struct {
	AttemptID   uint64     `json:"attempt_id"`
	Status      string     `json:"status"`
	StartedAt   *time.Time `json:"started_at"`
	SubmittedAt *time.Time `json:"submitted_at"`
	Score       int        `json:"score"`
}

// Checks whether student belongs to the class of the test
func (r *StudentTestsRepository) CanAccessTest(studentID, testID uint64) (bool, error) {
	var count int
	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM tests t
		JOIN student_classes sc ON sc.class_id = t.class_id
		WHERE t.id = ? AND sc.student_id = ?
	`, testID, studentID).Scan(&count)
	return count > 0, err
}

func (r *StudentTestsRepository) ListStudentTests(studentID uint64) ([]TestListItem, error) {
	rows, err := r.DB.Query(`
		SELECT
			t.id,
			t.class_id,
			t.title,
			COALESCE(t.description, ''),
			t.duration_minutes,
			t.total_marks,
			t.start_at,
			t.end_at,
			t.show_results,
			COALESCE(a.status, 'NOT_STARTED') AS attempt_status,
			COALESCE(a.score, 0) AS score
		FROM tests t
		JOIN student_classes sc ON sc.class_id = t.class_id AND sc.student_id = ?
		LEFT JOIN student_test_attempts a
			ON a.test_id = t.id AND a.student_id = sc.student_id
		ORDER BY t.start_at DESC
	`, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []TestListItem
	for rows.Next() {
		var it TestListItem
		var showResults int
		if err := rows.Scan(
			&it.ID,
			&it.ClassID,
			&it.Title,
			&it.Description,
			&it.DurationMinutes,
			&it.TotalMarks,
			&it.StartAt,
			&it.EndAt,
			&showResults,
			&it.AttemptStatus,
			&it.Score,
		); err != nil {
			return nil, err
		}
		it.ShowResults = showResults == 1
		list = append(list, it)
	}

	return list, nil
}

func (r *StudentTestsRepository) GetTestDetail(studentID, testID uint64) (*TestDetail, error) {
	var d TestDetail
	var showResults int

	var startedAt sql.NullTime
	var submittedAt sql.NullTime
	var status sql.NullString
	var score sql.NullInt64

	err := r.DB.QueryRow(`
		SELECT
			t.id,
			t.class_id,
			t.title,
			COALESCE(t.description, ''),
			t.duration_minutes,
			t.total_marks,
			t.start_at,
			t.end_at,
			t.show_results,
			a.status,
			a.started_at,
			a.submitted_at,
			a.score
		FROM tests t
		JOIN student_classes sc ON sc.class_id = t.class_id AND sc.student_id = ?
		LEFT JOIN student_test_attempts a
			ON a.test_id = t.id AND a.student_id = sc.student_id
		WHERE t.id = ?
	`, studentID, testID).Scan(
		&d.ID,
		&d.ClassID,
		&d.Title,
		&d.Description,
		&d.DurationMinutes,
		&d.TotalMarks,
		&d.StartAt,
		&d.EndAt,
		&showResults,
		&status,
		&startedAt,
		&submittedAt,
		&score,
	)
	if err != nil {
		return nil, err
	}

	d.ShowResults = showResults == 1
	d.AttemptStatus = "NOT_STARTED"
	d.Score = 0

	if status.Valid {
		d.AttemptStatus = status.String
	}
	if score.Valid {
		d.Score = int(score.Int64)
	}
	if startedAt.Valid {
		t := startedAt.Time
		d.StartedAt = &t
	}
	if submittedAt.Valid {
		t := submittedAt.Time
		d.SubmittedAt = &t
	}

	return &d, nil
}

func (r *StudentTestsRepository) GetAttempt(studentID, testID uint64) (*AttemptInfo, error) {
	var a AttemptInfo
	var startedAt sql.NullTime
	var submittedAt sql.NullTime

	err := r.DB.QueryRow(`
		SELECT id, status, started_at, submitted_at, score
		FROM student_test_attempts
		WHERE student_id = ? AND test_id = ?
	`, studentID, testID).Scan(
		&a.AttemptID,
		&a.Status,
		&startedAt,
		&submittedAt,
		&a.Score,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if startedAt.Valid {
		t := startedAt.Time
		a.StartedAt = &t
	}
	if submittedAt.Valid {
		t := submittedAt.Time
		a.SubmittedAt = &t
	}

	return &a, nil
}

// Create attempt if not exist, otherwise resume it if NOT_STARTED
func (r *StudentTestsRepository) CreateOrResumeAttempt(studentID, testID uint64) (*AttemptInfo, error) {
	existing, err := r.GetAttempt(studentID, testID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		if existing.Status == "NOT_STARTED" {
			_, err := r.DB.Exec(`
				UPDATE student_test_attempts
				SET status = 'IN_PROGRESS',
					started_at = COALESCE(started_at, NOW())
				WHERE id = ?
			`, existing.AttemptID)
			if err != nil {
				return nil, err
			}
			return r.GetAttempt(studentID, testID)
		}
		return existing, nil
	}

	// IMPORTANT: this requires UNIQUE(test_id, student_id) to behave properly in future edits
	_, err = r.DB.Exec(`
		INSERT INTO student_test_attempts (test_id, student_id, started_at, status, score)
		VALUES (?, ?, NOW(), 'IN_PROGRESS', 0)
	`, testID, studentID)
	if err != nil {
		return nil, err
	}

	return r.GetAttempt(studentID, testID)
}

func (r *StudentTestsRepository) ListQuestions(testID uint64) ([]StudentQuestion, error) {
	rows, err := r.DB.Query(`
		SELECT id, question, option_a, option_b, option_c, option_d, marks
		FROM test_questions
		WHERE test_id = ?
		ORDER BY id ASC
	`, testID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []StudentQuestion
	for rows.Next() {
		var q StudentQuestion
		if err := rows.Scan(
			&q.ID,
			&q.Question,
			&q.OptionA,
			&q.OptionB,
			&q.OptionC,
			&q.OptionD,
			&q.Marks,
		); err != nil {
			return nil, err
		}
		list = append(list, q)
	}

	return list, nil
}

// Save/overwrite answer (requires UNIQUE(attempt_id, question_id))
func (r *StudentTestsRepository) SaveAnswer(attemptID, questionID uint64, selectedOption string) error {
	_, err := r.DB.Exec(`
		INSERT INTO student_test_answers (attempt_id, question_id, selected_option, is_correct, marks_awarded)
		VALUES (?, ?, ?, 0, 0)
		ON DUPLICATE KEY UPDATE
			selected_option = VALUES(selected_option),
			updated_at = CURRENT_TIMESTAMP
	`, attemptID, questionID, selectedOption)
	return err
}

// Grade MCQ attempt.
// Future: written answers can be manually graded later; keep this method MCQ-only for now.
func (r *StudentTestsRepository) GradeAttempt(attemptID, testID uint64) (int, error) {
	_, err := r.DB.Exec(`
		UPDATE student_test_answers a
		JOIN test_questions q ON q.id = a.question_id
		SET
			a.is_correct = (a.selected_option = q.correct_option),
			a.marks_awarded = IF(a.selected_option = q.correct_option, q.marks, 0)
		WHERE a.attempt_id = ? AND q.test_id = ?
	`, attemptID, testID)
	if err != nil {
		return 0, err
	}

	var score int
	err = r.DB.QueryRow(`
		SELECT COALESCE(SUM(marks_awarded), 0)
		FROM student_test_answers
		WHERE attempt_id = ?
	`, attemptID).Scan(&score)
	if err != nil {
		return 0, err
	}

	_, err = r.DB.Exec(`
		UPDATE student_test_attempts
		SET score = ?
		WHERE id = ?
	`, score, attemptID)
	if err != nil {
		return 0, err
	}

	return score, nil
}

func (r *StudentTestsRepository) SubmitAttempt(attemptID uint64) error {
	_, err := r.DB.Exec(`
		UPDATE student_test_attempts
		SET status = 'SUBMITTED', submitted_at = NOW()
		WHERE id = ? AND status = 'IN_PROGRESS'
	`, attemptID)
	return err
}
func (r *StudentTestsRepository) GetDBTime() (time.Time, error) {
	var t time.Time
	err := r.DB.QueryRow("SELECT NOW()").Scan(&t)
	return t, err
}
