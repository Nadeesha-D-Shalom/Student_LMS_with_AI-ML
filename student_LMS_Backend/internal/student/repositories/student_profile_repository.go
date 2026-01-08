package repositories

import (
	"database/sql"
	"errors"

	"student_LMS_Backend/internal/database"
)

type StudentProfileRepository struct {
	DB *sql.DB
}

func NewStudentProfileRepository() *StudentProfileRepository {
	return &StudentProfileRepository{
		DB: database.DB,
	}
}

/* ===============================
   GET PROFILE (JOIN students + users)
================================ */

func (r *StudentProfileRepository) GetProfile(userID uint64) (map[string]interface{}, error) {

	var (
		firstName string
		lastName  sql.NullString
		email     string
		phone     sql.NullString
		address   sql.NullString
		avatarURL sql.NullString
	)

	err := r.DB.QueryRow(`
		SELECT
			s.first_name,
			s.last_name,
			u.email,
			s.personal_mobile,
			s.address,
			u.avatar_url
		FROM students s
		JOIN users u ON u.id = s.user_id
		WHERE s.user_id = ?
	`, userID).Scan(
		&firstName,
		&lastName,
		&email,
		&phone,
		&address,
		&avatarURL,
	)

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"user_id":    userID,
		"first_name": firstName, // locked
		"last_name":  nullToString(lastName),
		"email":      email, // locked
		"phone":      nullToString(phone),
		"address":    nullToString(address),
		"avatar_url": nullToString(avatarURL),
	}, nil
}

/* ===============================
   UPDATE PROFILE
================================ */

func (r *StudentProfileRepository) UpdateProfile(
	userID uint64,
	lastName string,
	phone string,
	address string,
	avatarURL string,
) error {

	_, err := r.DB.Exec(`
		UPDATE students
		SET last_name = ?, personal_mobile = ?, address = ?
		WHERE user_id = ?
	`, lastName, phone, address, userID)
	if err != nil {
		return err
	}

	_, err = r.DB.Exec(`
		UPDATE users
		SET avatar_url = ?
		WHERE id = ?
	`, avatarURL, userID)

	return err
}

/* ===============================
   PASSWORD
================================ */

func (r *StudentProfileRepository) GetPasswordHash(userID uint64) (string, error) {
	var hash string
	err := r.DB.QueryRow(`
		SELECT password_hash
		FROM users
		WHERE id = ?
	`, userID).Scan(&hash)

	if err != nil {
		return "", err
	}

	if hash == "" {
		return "", errors.New("password not set")
	}

	return hash, nil
}

func (r *StudentProfileRepository) UpdatePasswordHash(
	userID uint64,
	newHash string,
) error {
	_, err := r.DB.Exec(`
		UPDATE users
		SET password_hash = ?
		WHERE id = ?
	`, newHash, userID)
	return err
}

/* ===============================
   UTILITY
================================ */

func nullToString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}
