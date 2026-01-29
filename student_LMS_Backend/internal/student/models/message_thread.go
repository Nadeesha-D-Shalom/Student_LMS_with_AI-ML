package models

import "time"

type MessageThreadInboxItem struct {
	ThreadID      uint64    `json:"thread_id"`
	Subject       string    `json:"subject"`
	TeacherID     uint64    `json:"teacher_id"`
	TeacherName   string    `json:"teacher_name"`
	Status        string    `json:"status"` // PENDING | REVIEW | COMPLETED
	LastMessage   string    `json:"last_message"`
	LastMessageAt time.Time `json:"last_message_at"`
	UnreadCount   int       `json:"unread_count"`
}

type MessageThreadDetail struct {
	ThreadID      uint64    `json:"thread_id"`
	Subject       string    `json:"subject"`
	Status        string    `json:"status"`
	TeacherID     uint64    `json:"teacher_id"`
	TeacherName   string    `json:"teacher_name"`
	StudentID     uint64    `json:"student_id"`
	LastMessageAt time.Time `json:"last_message_at"`
}
