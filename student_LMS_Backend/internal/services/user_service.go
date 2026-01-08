package services

import (
	"errors"

	"golang.org/x/crypto/bcrypt"

	"student_LMS_Backend/internal/models"
	"student_LMS_Backend/internal/repositories"

	"student_LMS_Backend/internal/utils"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: repositories.NewUserRepository(),
	}
}

func (s *UserService) RegisterUser(
	fullName string,
	email string,
	password string,
	role string,
) error {

	_, err := s.repo.FindByEmail(email)
	if err == nil {
		return errors.New("email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	user := &models.User{
		FullName:     fullName,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         role,
		IsActive:     true,
	}

	return s.repo.Create(user)
}

func (s *UserService) Login(email string, password string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	return utils.GenerateToken(user.ID, user.Role)
}
func (s *UserService) GetCurrentUser(userID uint64) (*models.User, error) {
	return s.repo.FindByID(userID)
}
