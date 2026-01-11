package models

import "time"

type AnnouncementItem struct {
	ID          uint64    `json:"id"`
	Title       string    `json:"title"`
	Message     string    `json:"message"`
	PublishedAt time.Time `json:"published_at"`
}
