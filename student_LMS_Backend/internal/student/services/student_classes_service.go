package services

import (
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentClassesService struct {
	repo *repositories.StudentClassesRepository
}

func NewStudentClassesService() *StudentClassesService {
	return &StudentClassesService{
		repo: repositories.NewStudentClassesRepository(database.DB),
	}
}

func (s *StudentClassesService) GetStudentClasses(studentUserID uint64) ([]repositories.StudentClassItem, error) {
	return s.repo.GetStudentClasses(studentUserID)
}
