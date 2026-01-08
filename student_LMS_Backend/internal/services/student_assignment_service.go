package services

import (
	"errors"

	"student_LMS_Backend/internal/repositories"
)

type StudentAssignmentService struct {
	repo *repositories.StudentAssignmentRepository
}

func NewStudentAssignmentService() *StudentAssignmentService {
	return &StudentAssignmentService{
		repo: repositories.NewStudentAssignmentRepository(),
	}
}

func (s *StudentAssignmentService) GetAllAssignments(studentID uint64) ([]map[string]interface{}, error) {
	return s.repo.FetchStudentAssignments(studentID)
}

func (s *StudentAssignmentService) GetAssignmentDetail(studentID, assignmentID uint64) (map[string]interface{}, error) {
	allowed, err := s.repo.CanAccessAssignment(studentID, assignmentID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("access denied")
	}

	return s.repo.FetchAssignmentDetail(studentID, assignmentID)
}

func (s *StudentAssignmentService) SubmitAssignment(studentID, assignmentID uint64, url string) error {
	allowed, err := s.repo.CanAccessAssignment(studentID, assignmentID)
	if err != nil {
		return err
	}
	if !allowed {
		return errors.New("access denied")
	}

	return s.repo.SaveSubmission(studentID, assignmentID, url)
}
