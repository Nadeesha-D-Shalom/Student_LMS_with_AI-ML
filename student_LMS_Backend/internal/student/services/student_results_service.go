package services

import (
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentResultsService struct {
	repo *repositories.StudentResultsRepository
}

func NewStudentResultsService() *StudentResultsService {
	return &StudentResultsService{
		repo: repositories.NewStudentResultsRepository(database.DB),
	}
}

func (s *StudentResultsService) List(studentID uint64) ([]repositories.StudentResultItem, error) {
	return s.repo.List(studentID)
}
