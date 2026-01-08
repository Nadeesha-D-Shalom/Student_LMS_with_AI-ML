package services

import (
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/repositories"
)

type StudentLiveClassesService struct {
	repo *repositories.StudentLiveClassRepository
}

func NewStudentLiveClassesService() *StudentLiveClassesService {
	return &StudentLiveClassesService{
		repo: repositories.NewStudentLiveClassRepository(database.DB),
	}
}

func (s *StudentLiveClassesService) Get(studentID uint64) (map[string]interface{}, error) {
	return s.repo.Fetch(studentID)
}
