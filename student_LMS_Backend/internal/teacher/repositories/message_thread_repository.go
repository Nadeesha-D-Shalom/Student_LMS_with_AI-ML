package repositories

import (
	"database/sql"
	"strings"
	"time"
)

/*
=====================================================
DTOs
=====================================================
*/

type TeacherInboxItem struct {
	ThreadID      uint64    `json:"thread_id"`
	Subject       string    `json:"subject"`
	Status        string    `json:"status"` // PENDING | REVIEW | COMPLETED
	LastMessage   string    `json:"last_message"`
	LastMessageAt time.Time `json:"last_message_at"`

	StudentID    uint64 `json:"student_id"`
	StudentName  string `json:"student_name"`
	StudentClass string `json:"student_class"`

	UnreadCount int `json:"unread_count"`
}

type TeacherThreadDetail struct {
	ThreadID      uint64    `json:"thread_id"`
	Subject       string    `json:"subject"`
	Status        string    `json:"status"`
	LastMessageAt time.Time `json:"last_message_at"`

	TeacherID uint64 `json:"teacher_id"`
	StudentID uint64 `json:"student_id"`

	StudentName  string `json:"student_name"`
	StudentClass string `json:"student_class"`
}

/*
=====================================================
Repository
=====================================================
*/

type MessageThreadRepository struct {
	DB *sql.DB
}

func NewMessageThreadRepository(db *sql.DB) *MessageThreadRepository {
	return &MessageThreadRepository{DB: db}
}

/*
=====================================================
Teacher Inbox
=====================================================
*/
func (r *MessageThreadRepository) TeacherInbox(teacherID uint64, search string) ([]TeacherInboxItem, error) {
	search = strings.TrimSpace(search)

	var rows *sql.Rows
	var err error

	baseQuery := `
		SELECT
			t.id,
			t.subject,
			t.status,
			COALESCE(ms.message, '') AS last_message,
			t.last_message_at,

			t.student_id,
			COALESCE(u.full_name, '') AS student_name,
			'' AS student_class,

			COALESCE(unread.cnt, 0) AS unread_count
		FROM message_threads t
		LEFT JOIN users u
			ON u.id = t.student_id
			AND u.role = 'STUDENT'
		LEFT JOIN (
			SELECT s1.thread_id, s1.message
			FROM message_stack s1
			INNER JOIN (
				SELECT thread_id, MAX(id) AS max_id
				FROM message_stack
				GROUP BY thread_id
			) s2
				ON s2.thread_id = s1.thread_id
				AND s2.max_id = s1.id
		) ms ON ms.thread_id = t.id
		LEFT JOIN (
			SELECT thread_id, COUNT(*) AS cnt
			FROM message_stack
			WHERE receiver_role = 'TEACHER'
			  AND receiver_id = ?
			  AND is_read = FALSE
			GROUP BY thread_id
		) unread ON unread.thread_id = t.id
		WHERE t.teacher_id = ?
		  AND t.is_deleted = FALSE
	`

	if search == "" {
		rows, err = r.DB.Query(baseQuery+` ORDER BY t.last_message_at DESC`, teacherID, teacherID)
	} else {
		like := "%" + search + "%"
		rows, err = r.DB.Query(
			baseQuery+` AND (t.subject LIKE ? OR u.full_name LIKE ?) ORDER BY t.last_message_at DESC`,
			teacherID,
			teacherID,
			like,
			like,
		)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]TeacherInboxItem, 0)
	for rows.Next() {
		var it TeacherInboxItem
		if err := rows.Scan(
			&it.ThreadID,
			&it.Subject,
			&it.Status,
			&it.LastMessage,
			&it.LastMessageAt,
			&it.StudentID,
			&it.StudentName,
			&it.StudentClass,
			&it.UnreadCount,
		); err != nil {
			return nil, err
		}
		items = append(items, it)
	}

	return items, nil
}

/*
=====================================================
Teacher View Thread
=====================================================
*/
func (r *MessageThreadRepository) TeacherThreadDetail(teacherID, threadID uint64) (*TeacherThreadDetail, error) {
	var d TeacherThreadDetail

	err := r.DB.QueryRow(`
		SELECT
			t.id,
			t.subject,
			t.status,
			t.last_message_at,
			t.teacher_id,
			t.student_id,
			COALESCE(u.full_name, '') AS student_name,
			'' AS student_class
		FROM message_threads t
		JOIN users u
			ON u.id = t.student_id
			AND u.role = 'STUDENT'
		WHERE t.id = ?
		  AND t.teacher_id = ?
		  AND t.is_deleted = FALSE
	`, threadID, teacherID).Scan(
		&d.ThreadID,
		&d.Subject,
		&d.Status,
		&d.LastMessageAt,
		&d.TeacherID,
		&d.StudentID,
		&d.StudentName,
		&d.StudentClass,
	)

	if err != nil {
		return nil, err
	}

	return &d, nil
}

/*
=====================================================
Status Helpers
=====================================================
*/

func (r *MessageThreadRepository) MarkReviewIfPending(threadID uint64) error {
	_, err := r.DB.Exec(`
		UPDATE message_threads
		SET status = 'REVIEW'
		WHERE id = ?
		  AND status = 'PENDING'
	`, threadID)
	return err
}

func (r *MessageThreadRepository) MarkCompleted(threadID uint64) error {
	_, err := r.DB.Exec(`
		UPDATE message_threads
		SET status = 'COMPLETED'
		WHERE id = ?
	`, threadID)
	return err
}

func (r *MessageThreadRepository) TouchLastMessageAt(threadID uint64) error {
	_, err := r.DB.Exec(`
		UPDATE message_threads
		SET last_message_at = NOW()
		WHERE id = ?
	`, threadID)
	return err
}
