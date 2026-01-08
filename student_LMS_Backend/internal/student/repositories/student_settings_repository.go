package repositories

import (
	"database/sql"

	"student_LMS_Backend/internal/database"
)

type StudentSettingsRepository struct {
	DB *sql.DB
}

func NewStudentSettingsRepository() *StudentSettingsRepository {
	return &StudentSettingsRepository{DB: database.DB}
}

func (r *StudentSettingsRepository) EnsureSettingsRow(userID uint64) error {
	_, err := r.DB.Exec(`INSERT IGNORE INTO student_settings (user_id) VALUES (?)`, userID)
	return err
}

func (r *StudentSettingsRepository) GetSettings(userID uint64) (map[string]interface{}, error) {
	_ = r.EnsureSettingsRow(userID)

	var (
		emailNoti bool
		smsNoti   bool
		darkMode  bool
		language  string
	)

	err := r.DB.QueryRow(`
		SELECT email_notifications, sms_notifications, dark_mode, language
		FROM student_settings
		WHERE user_id = ?
	`, userID).Scan(&emailNoti, &smsNoti, &darkMode, &language)

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"user_id":             userID,
		"email_notifications": emailNoti,
		"sms_notifications":   smsNoti,
		"dark_mode":           darkMode,
		"language":            language,
	}, nil
}

func (r *StudentSettingsRepository) UpdateSettings(
	userID uint64,
	emailNoti, smsNoti, darkMode bool,
	language string,
) error {
	_ = r.EnsureSettingsRow(userID)

	_, err := r.DB.Exec(`
		UPDATE student_settings
		SET email_notifications = ?, sms_notifications = ?, dark_mode = ?, language = ?
		WHERE user_id = ?
	`, emailNoti, smsNoti, darkMode, language, userID)

	return err
}
