package services

import (
	"strings"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentSettingsService struct {
	repo *repositories.StudentSettingsRepository
}

func NewStudentSettingsService() *StudentSettingsService {
	return &StudentSettingsService{
		repo: repositories.NewStudentSettingsRepository(),
	}
}

func (s *StudentSettingsService) Get(userID uint64) (map[string]interface{}, error) {
	return s.repo.GetSettings(userID)
}

func (s *StudentSettingsService) Update(
	userID uint64,
	emailNoti, smsNoti, darkMode bool,
	language string,
) error {
	language = strings.TrimSpace(language)
	if language == "" {
		language = "en"
	}
	return s.repo.UpdateSettings(userID, emailNoti, smsNoti, darkMode, language)
}
