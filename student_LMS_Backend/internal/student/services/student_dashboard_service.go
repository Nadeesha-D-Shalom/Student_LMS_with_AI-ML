package services

import (
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentDashboardService struct {
	repo *repositories.StudentDashboardRepository
}

func NewStudentDashboardService() *StudentDashboardService {
	return &StudentDashboardService{
		repo: repositories.NewStudentDashboardRepository(database.DB),
	}
}

func (s *StudentDashboardService) GetDashboard(studentUserID uint64) (map[string]int, error) {
	return s.repo.GetStats(studentUserID)
}
