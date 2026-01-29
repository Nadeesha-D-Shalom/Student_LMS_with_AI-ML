package models

import "time"

type MessageStackItem struct {
	ID           uint64    `json:"id"`
	ThreadID     uint64    `json:"thread_id"`
	SenderRole   string    `json:"sender_role"` // STUDENT | TEACHER
	SenderID     uint64    `json:"sender_id"`
	ReceiverRole string    `json:"receiver_role"` // STUDENT | TEACHER
	ReceiverID   uint64    `json:"receiver_id"`
	Message      string    `json:"message"`
	IsRead       bool      `json:"is_read"`
	SentAt       time.Time `json:"sent_at"`
}
