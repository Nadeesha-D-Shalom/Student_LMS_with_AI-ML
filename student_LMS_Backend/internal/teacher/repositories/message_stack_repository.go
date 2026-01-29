package repositories

import (
	"database/sql"
	"time"
)

type StackItem struct {
	ID           uint64    `json:"id"`
	ThreadID     uint64    `json:"thread_id"`
	SenderRole   string    `json:"sender_role"`
	SenderID     uint64    `json:"sender_id"`
	ReceiverRole string    `json:"receiver_role"`
	ReceiverID   uint64    `json:"receiver_id"`
	Message      string    `json:"message"`
	IsRead       bool      `json:"is_read"`
	SentAt       time.Time `json:"sent_at"`
}

type MessageStackRepository struct {
	DB *sql.DB
}

func NewMessageStackRepository(db *sql.DB) *MessageStackRepository {
	return &MessageStackRepository{DB: db}
}

func (r *MessageStackRepository) GetThreadStack(threadID uint64) ([]StackItem, error) {
	rows, err := r.DB.Query(`
		SELECT
			id, thread_id, sender_role, sender_id, receiver_role, receiver_id,
			message, is_read, sent_at
		FROM message_stack
		WHERE thread_id = ?
		ORDER BY id DESC
	`, threadID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]StackItem, 0)
	for rows.Next() {
		var it StackItem
		if err := rows.Scan(
			&it.ID,
			&it.ThreadID,
			&it.SenderRole,
			&it.SenderID,
			&it.ReceiverRole,
			&it.ReceiverID,
			&it.Message,
			&it.IsRead,
			&it.SentAt,
		); err != nil {
			return nil, err
		}
		items = append(items, it)
	}

	return items, nil
}

func (r *MessageStackRepository) MarkTeacherMessagesRead(threadID, teacherID uint64) {
	_, _ = r.DB.Exec(`
		UPDATE message_stack
		SET is_read = TRUE
		WHERE thread_id = ?
		  AND receiver_role = 'TEACHER'
		  AND receiver_id = ?
		  AND is_read = FALSE
	`, threadID, teacherID)
}

func (r *MessageStackRepository) PushTeacherReply(threadID, teacherID, studentID uint64, message string) error {
	_, err := r.DB.Exec(`
		INSERT INTO message_stack (
			thread_id,
			sender_role, sender_id,
			receiver_role, receiver_id,
			message,
			is_read,
			sent_at
		) VALUES (?, 'TEACHER', ?, 'STUDENT', ?, ?, FALSE, NOW())
	`, threadID, teacherID, studentID, message)
	return err
}
