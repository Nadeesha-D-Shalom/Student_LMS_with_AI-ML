package repositories

import (
	"database/sql"
	"errors"
	"strings"

	"student_LMS_Backend/internal/student/models"
)

type MessageThreadRepository struct {
	DB *sql.DB
}

func NewMessageThreadRepository(db *sql.DB) *MessageThreadRepository {
	return &MessageThreadRepository{DB: db}
}

func (r *MessageThreadRepository) CreateThread(studentID, teacherID uint64, subject string) (uint64, error) {
	subject = strings.TrimSpace(subject)
	if subject == "" {
		return 0, errors.New("subject is required")
	}

	res, err := r.DB.Exec(`
		INSERT INTO message_threads (
			student_id,
			teacher_id,
			subject,
			created_by,
			status,
			last_message_at,
			is_deleted
		) VALUES (?, ?, ?, ?, 'PENDING', NOW(), FALSE)
	`, studentID, teacherID, subject, studentID)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint64(id), nil
}

/*
=====================================================
Student Inbox (Thread List)
=====================================================
*/
func (r *MessageThreadRepository) StudentInbox(studentID uint64) ([]models.MessageThreadInboxItem, error) {

	rows, err := r.DB.Query(`
		SELECT
			t.id AS thread_id,
			t.subject,
			t.teacher_id,
			COALESCE(u.full_name, '') AS teacher_name,
			t.status,
			COALESCE(ms.message, '') AS last_message,
			t.last_message_at,
			COALESCE(unread.cnt, 0) AS unread_count
		FROM message_threads t
		LEFT JOIN users u
			ON u.id = t.teacher_id
			AND u.role = 'TEACHER'
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
			WHERE receiver_role = 'STUDENT'
			  AND receiver_id = ?
			  AND is_read = FALSE
			GROUP BY thread_id
		) unread ON unread.thread_id = t.id
		WHERE t.student_id = ?
		  AND t.is_deleted = FALSE
		ORDER BY t.last_message_at DESC
	`, studentID, studentID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]models.MessageThreadInboxItem, 0)

	for rows.Next() {
		var it models.MessageThreadInboxItem
		if err := rows.Scan(
			&it.ThreadID,
			&it.Subject,
			&it.TeacherID,
			&it.TeacherName,
			&it.Status,
			&it.LastMessage,
			&it.LastMessageAt,
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
Student View Thread
=====================================================
*/
func (r *MessageThreadRepository) StudentThreadDetail(studentID, threadID uint64) (*models.MessageThreadDetail, error) {

	var d models.MessageThreadDetail

	err := r.DB.QueryRow(`
		SELECT
			t.id,
			t.subject,
			t.status,
			t.teacher_id,
			COALESCE(u.full_name, '') AS teacher_name,
			t.student_id,
			t.last_message_at
		FROM message_threads t
		LEFT JOIN users u
			ON u.id = t.teacher_id
			AND u.role = 'TEACHER'
		WHERE t.id = ?
		  AND t.student_id = ?
		  AND t.is_deleted = FALSE
	`, threadID, studentID).Scan(
		&d.ThreadID,
		&d.Subject,
		&d.Status,
		&d.TeacherID,
		&d.TeacherName,
		&d.StudentID,
		&d.LastMessageAt,
	)

	if err != nil {
		return nil, err
	}

	return &d, nil
}

func (r *MessageThreadRepository) UpdateLastMessageAt(threadID uint64) error {
	_, err := r.DB.Exec(`
		UPDATE message_threads
		SET last_message_at = NOW()
		WHERE id = ?
	`, threadID)
	return err
}
