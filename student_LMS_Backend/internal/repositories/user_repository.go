package repositories

import (
	"database/sql"

	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		DB: database.DB,
	}
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at
		FROM users
		WHERE email = ?
	`

	row := r.DB.QueryRow(query, email)

	var user models.User
	err := row.Scan(
		&user.ID,
		&user.FullName,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (full_name, email, password_hash, role, is_active)
		VALUES (?, ?, ?, ?, ?)
	`

	_, err := r.DB.Exec(
		query,
		user.FullName,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IsActive,
	)

	return err
}
func (r *UserRepository) FindByID(id uint64) (*models.User, error) {
	query := `
		SELECT id, full_name, email, role, is_active, created_at, updated_at
		FROM users
		WHERE id = ?
	`

	row := r.DB.QueryRow(query, id)

	var user models.User
	err := row.Scan(
		&user.ID,
		&user.FullName,
		&user.Email,
		&user.Role,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
