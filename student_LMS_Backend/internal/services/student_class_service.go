package services

import (
	"errors"
	"student_LMS_Backend/internal/database"
	"student_LMS_Backend/internal/repositories"
)

type StudentClassService struct {
	repo *repositories.StudentClassRepository
}

func NewStudentClassService() *StudentClassService {
	return &StudentClassService{
		repo: repositories.NewStudentClassRepository(database.DB),
	}
}

func (s *StudentClassService) GetGrades(studentID, classID uint64) ([]map[string]interface{}, error) {
	ok, err := s.repo.StudentInClass(studentID, classID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, errors.New("student not enrolled in class")
	}

	// Current LMS = single grade per class
	return []map[string]interface{}{
		{
			"grade_id": classID,
			"label":    "Main Grade",
		},
	}, nil
}
