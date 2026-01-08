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
	return &StudentProfileRepository{DB: database.DB}
}

/*
Assumptions:
- users table has: id, first_name, email, password_hash (bcrypt)
- student_profiles table stores editable fields only.
*/

func (r *StudentProfileRepository) EnsureProfileRow(userID uint64) error {
	_, err := r.DB.Exec(`INSERT IGNORE INTO student_profiles (user_id) VALUES (?)`, userID)
	return err
}

func (r *StudentProfileRepository) GetProfile(userID uint64) (map[string]interface{}, error) {
	_ = r.EnsureProfileRow(userID)

	var (
		firstName string
		email     string

		lastName  sql.NullString
		phone     sql.NullString
		address   sql.NullString
		bio       sql.NullString
		avatarURL sql.NullString
		updatedAt sql.NullTime
	)

	err := r.DB.QueryRow(`
		SELECT
			u.first_name,
			u.email,
			sp.last_name,
			sp.phone,
			sp.address,
			sp.bio,
			sp.avatar_url,
			sp.updated_at
		FROM users u
		LEFT JOIN student_profiles sp ON sp.user_id = u.id
		WHERE u.id = ?
	`, userID).Scan(
		&firstName,
		&email,
		&lastName,
		&phone,
		&address,
		&bio,
		&avatarURL,
		&updatedAt,
	)

	if err != nil {
		return nil, err
	}

	out := map[string]interface{}{
		"user_id":    userID,
		"first_name": firstName, // locked
		"email":      email,     // locked
		"last_name":  "",
		"phone":      "",
		"address":    "",
		"bio":        "",
		"avatar_url": "",
		"updated_at": nil,
	}

	if lastName.Valid {
		out["last_name"] = lastName.String
	}
	if phone.Valid {
		out["phone"] = phone.String
	}
	if address.Valid {
		out["address"] = address.String
	}
	if bio.Valid {
		out["bio"] = bio.String
	}
	if avatarURL.Valid {
		out["avatar_url"] = avatarURL.String
	}
	if updatedAt.Valid {
		out["updated_at"] = updatedAt.Time
	}

	return out, nil
}

func (r *StudentProfileRepository) UpdateProfile(
	userID uint64,
	lastName, phone, address, bio, avatarURL string,
) error {
	_ = r.EnsureProfileRow(userID)

	_, err := r.DB.Exec(`
		UPDATE student_profiles
		SET last_name = ?, phone = ?, address = ?, bio = ?, avatar_url = ?
		WHERE user_id = ?
	`, lastName, phone, address, bio, avatarURL, userID)
	return err
}

func (r *StudentProfileRepository) GetPasswordHash(userID uint64) (string, error) {
	var hash string
	err := r.DB.QueryRow(`SELECT password_hash FROM users WHERE id = ?`, userID).Scan(&hash)
	if err != nil {
		return "", err
	}
	if hash == "" {
		return "", errors.New("password not set")
	}
	return hash, nil
}

func (r *StudentProfileRepository) UpdatePasswordHash(userID uint64, newHash string) error {
	_, err := r.DB.Exec(`UPDATE users SET password_hash = ? WHERE id = ?`, newHash, userID)
	return err
}
