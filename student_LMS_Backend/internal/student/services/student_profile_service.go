package services

import (
	"errors"
	"strings"
	"student_LMS_Backend/internal/student/repositories"

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

/* ===============================
   GET PROFILE
================================ */

func (s *StudentProfileService) Get(userID uint64) (map[string]interface{}, error) {
	return s.repo.GetProfile(userID)
}

/* ===============================
   UPDATE PROFILE (NO EMAIL / FIRST NAME)
================================ */

func (s *StudentProfileService) Update(
	userID uint64,
	lastName string,
	phone string,
	address string,
	avatarURL string,
) error {

	lastName = strings.TrimSpace(lastName)
	phone = strings.TrimSpace(phone)
	address = strings.TrimSpace(address)
	avatarURL = strings.TrimSpace(avatarURL)

	return s.repo.UpdateProfile(
		userID,
		lastName,
		phone,
		address,
		avatarURL,
	)
}

/* ===============================
   CHANGE PASSWORD (VERIFIED)
================================ */

func (s *StudentProfileService) ChangePassword(
	userID uint64,
	currentPassword string,
	newPassword string,
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

	if err := bcrypt.CompareHashAndPassword(
		[]byte(hash),
		[]byte(currentPassword),
	); err != nil {
		return errors.New("current password is incorrect")
	}

	newHash, err := bcrypt.GenerateFromPassword(
		[]byte(newPassword),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return errors.New("failed to hash password")
	}

	return s.repo.UpdatePasswordHash(userID, string(newHash))
}
