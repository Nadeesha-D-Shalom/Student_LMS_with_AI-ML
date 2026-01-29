package repositories

import (
	"database/sql"

	"student_LMS_Backend/internal/student/models"
)

type MessageStackRepository struct {
	DB *sql.DB
}

func NewMessageStackRepository(db *sql.DB) *MessageStackRepository {
	return &MessageStackRepository{DB: db}
}

func (r *MessageStackRepository) PushMessage(
	threadID uint64,
	senderRole string,
	senderID uint64,
	receiverRole string,
	receiverID uint64,
	message string,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO message_stack (
			thread_id, sender_role, sender_id, receiver_role, receiver_id,
			message, is_read, sent_at
		) VALUES (?, ?, ?, ?, ?, ?, FALSE, NOW())
	`, threadID, senderRole, senderID, receiverRole, receiverID, message)
	return err
}

func (r *MessageStackRepository) GetThreadStackForStudent(studentID, threadID uint64) ([]models.MessageStackItem, error) {
	// Stack behavior:
	// - return newest first (LIFO) using ORDER BY id DESC
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

	items := make([]models.MessageStackItem, 0)
	for rows.Next() {
		var it models.MessageStackItem
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

	// Mark teacher messages as read when student views the thread
	_, _ = r.DB.Exec(`
		UPDATE message_stack
		SET is_read = TRUE
		WHERE thread_id = ?
		  AND receiver_role = 'STUDENT'
		  AND receiver_id = ?
		  AND is_read = FALSE
	`, threadID, studentID)

	return items, nil
}
