package models

import "time"

type AnnouncementItem struct {
	ID          uint64    `json:"id"`
	Title       string    `json:"title"`
	Message     string    `json:"message"`
	PublishedAt time.Time `json:"published_at"`
}

type CreateAnnouncementRequest struct {
	Title      string `json:"title" binding:"required"`
	Message    string `json:"message" binding:"required"`
	TargetRole string `json:"target_role" binding:"required"`
}

type UpdateAnnouncementRequest struct {
	Title      string `json:"title" binding:"required"`
	Message    string `json:"message" binding:"required"`
	TargetRole string `json:"target_role" binding:"required"`
	IsActive   bool   `json:"is_active"`
}
