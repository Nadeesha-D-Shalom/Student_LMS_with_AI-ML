package repositories

import (
	"database/sql"
	"student_LMS_Backend/internal/student/models"
)

type MessageRepository struct {
	DB *sql.DB
}

func NewMessageRepository(db *sql.DB) *MessageRepository {
	return &MessageRepository{DB: db}
}

/*
=====================================================
Inbox List
=====================================================
*/
func (r *MessageRepository) GetInbox(studentID uint64) ([]models.MessageInboxItem, error) {
	rows, err := r.DB.Query(`
		SELECT
			id,
			subject,
			receiver_role,
			encrypted_content AS last_message,
			status,
			last_message_at
		FROM messages
		WHERE student_id = ?
		ORDER BY last_message_at DESC
	`, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]models.MessageInboxItem, 0)

	for rows.Next() {
		var m models.MessageInboxItem
		err := rows.Scan(
			&m.ID,
			&m.Subject,
			&m.ReceiverRole,
			&m.LastMessage,
			&m.Status,
			&m.LastMessageAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, m)
	}

	return items, nil
}

/*
=====================================================
Single Thread (View Message)
=====================================================
*/
func (r *MessageRepository) GetThread(studentID, messageID uint64) (*models.MessageThread, error) {
	var m models.MessageThread

	err := r.DB.QueryRow(`
		SELECT
			id,
			subject,
			receiver_role,
			encrypted_content,
			status,
			last_message_at
		FROM messages
		WHERE id = ? AND student_id = ?
	`, messageID, studentID).Scan(
		&m.ID,
		&m.Subject,
		&m.ReceiverRole,
		&m.Message,
		&m.Status,
		&m.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	/*
		Auto mark as SEEN
		ONLY if it was replied
	*/
	if m.Status == "REPLIED" {
		_, _ = r.DB.Exec(`
			UPDATE messages
			SET status = 'SEEN'
			WHERE id = ?
		`, messageID)

		m.Status = "SEEN"
	}

	return &m, nil
}

/*
=====================================================
Unread Count (Sidebar Badge)
=====================================================
*/
func (r *MessageRepository) GetUnreadCount(studentID uint64) (int, error) {
	var count int

	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM messages
		WHERE student_id = ?
		  AND status = 'PENDING'
	`, studentID).Scan(&count)

	return count, err
}

/*
=====================================================
Create Message (Ask Question)
=====================================================
*/
func (r *MessageRepository) CreateMessage(
	studentID uint64,
	receiverRole string,
	receiverID *uint64,
	subject string,
	message string,
) error {

	_, err := r.DB.Exec(`
		INSERT INTO messages (
			student_id,
			receiver_role,
			receiver_id,
			subject,
			encrypted_content,
			status,
			last_message_at
		) VALUES (?, ?, ?, ?, ?, 'PENDING', NOW())
	`,
		studentID,
		receiverRole,
		receiverID,
		subject,
		message,
	)

	return err
}
