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

/* -------- STUDENT READ -------- */

func (r *AnnouncementRepository) GetStudentAnnouncements() ([]models.AnnouncementItem, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, message, published_at
		FROM announcements
		WHERE is_active = 1
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
		if err := rows.Scan(&a.ID, &a.Title, &a.Message, &a.PublishedAt); err != nil {
			return nil, err
		}
		items = append(items, a)
	}

	return items, nil
}

/* -------- ADMIN / TEACHER READ -------- */

func (r *AnnouncementRepository) GetAllAnnouncements() ([]models.AnnouncementItem, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, message, published_at
		FROM announcements
		ORDER BY published_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.AnnouncementItem

	for rows.Next() {
		var a models.AnnouncementItem
		if err := rows.Scan(&a.ID, &a.Title, &a.Message, &a.PublishedAt); err != nil {
			return nil, err
		}
		items = append(items, a)
	}

	return items, nil
}

/* -------- CREATE -------- */

func (r *AnnouncementRepository) Create(
	title, message, targetRole string, publishedBy uint64,
) error {
	_, err := r.DB.Exec(`
		INSERT INTO announcements (title, message, target_role, published_by)
		VALUES (?, ?, ?, ?)
	`, title, message, targetRole, publishedBy)

	return err
}

/* -------- UPDATE -------- */

func (r *AnnouncementRepository) Update(
	id uint64, title, message, targetRole string, isActive bool,
) error {
	_, err := r.DB.Exec(`
		UPDATE announcements
		SET title = ?, message = ?, target_role = ?, is_active = ?
		WHERE id = ?
	`, title, message, targetRole, isActive, id)

	return err
}

/* -------- DELETE -------- */

func (r *AnnouncementRepository) Delete(id uint64) error {
	_, err := r.DB.Exec(`
		DELETE FROM announcements WHERE id = ?
	`, id)

	return err
}
