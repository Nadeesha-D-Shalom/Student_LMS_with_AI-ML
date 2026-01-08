package services

import (
	"errors"
	"strings"

	"student_LMS_Backend/internal/repositories"

	"golang.org/x/crypto/bcrypt"
)

type StudentProfileService struct {
	repo *repositories.StudentProfileRepository
}

func NewStudentProfileService() *StudentProfileService {
	return &StudentProfileService{
		repo: repositories.NewStudentProfileRepository(),
	}
}

func (s *StudentProfileService) Get(userID uint64) (map[string]interface{}, error) {
	return s.repo.GetProfile(userID)
}

func (s *StudentProfileService) Update(
	userID uint64,
	lastName, phone, address, bio, avatarURL string,
) error {
	lastName = strings.TrimSpace(lastName)
	phone = strings.TrimSpace(phone)
	address = strings.TrimSpace(address)
	bio = strings.TrimSpace(bio)
	avatarURL = strings.TrimSpace(avatarURL)

	return s.repo.UpdateProfile(userID, lastName, phone, address, bio, avatarURL)
}

func (s *StudentProfileService) ChangePassword(
	userID uint64,
	currentPassword, newPassword string,
) error {
	currentPassword = strings.TrimSpace(currentPassword)
	newPassword = strings.TrimSpace(newPassword)

	if len(newPassword) < 8 {
		return errors.New("new password must be at least 8 characters")
	}

	hash, err := s.repo.GetPasswordHash(userID)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(currentPassword)); err != nil {
		return errors.New("current password is incorrect")
	}

	newHashBytes, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash new password")
	}

	return s.repo.UpdatePasswordHash(userID, string(newHashBytes))
}
