package models

import "time"

/*
=====================================================
Inbox List Item (used in MessageInbox.jsx)
=====================================================
*/
type MessageInboxItem struct {
	ID            uint64    `json:"id"`
	Subject       string    `json:"subject"`
	ReceiverRole  string    `json:"receiver_role"`
	LastMessage   string    `json:"last_message"`
	Status        string    `json:"status"` // PENDING | SEEN | REPLIED
	LastMessageAt time.Time `json:"last_message_at"`
}

/*
=====================================================
Single Message Thread (used in MessageThread.jsx)
=====================================================
*/
type MessageThread struct {
	ID           uint64    `json:"id"`
	Subject      string    `json:"subject"`
	ReceiverRole string    `json:"receiver_role"`
	Message      string    `json:"message"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
}
