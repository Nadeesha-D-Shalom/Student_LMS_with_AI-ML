package repositories

import (
	"database/sql"
	"student_LMS_Backend/internal/student/models"
)

type AnnouncementRepository struct {
	DB *sql.DB
}

func NewAnnouncementRepository(db *sql.DB) *AnnouncementRepository {
	return &AnnouncementRepository{DB: db}
}

func (r *AnnouncementRepository) GetStudentAnnouncements() ([]models.AnnouncementItem, error) {
	rows, err := r.DB.Query(`
		SELECT
			id,
			title,
			message,
			published_at
		FROM announcements
		WHERE
			is_active = 1
			AND target_role IN ('STUDENT', 'ALL')
		ORDER BY published_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.AnnouncementItem

	for rows.Next() {
		var a models.AnnouncementItem
		if err := rows.Scan(
			&a.ID,
			&a.Title,
			&a.Message,
			&a.PublishedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, a)
	}

	return items, nil
}
