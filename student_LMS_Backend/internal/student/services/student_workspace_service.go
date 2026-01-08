package services

import (
	"errors"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentWorkspaceService struct {
	repo *repositories.StudentWorkspaceRepository
}

func NewStudentWorkspaceService() *StudentWorkspaceService {
	return &StudentWorkspaceService{
		repo: repositories.NewStudentWorkspaceRepository(),
	}
}

func (s *StudentWorkspaceService) GetWorkspace(studentID, classID uint64) (map[string]interface{}, error) {
	allowed, err := s.repo.IsStudentEnrolled(studentID, classID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("student not enrolled in this class")
	}

	notices, err := s.repo.GetNotices(classID)
	if err != nil {
		return nil, err
	}

	materials, err := s.repo.GetMaterials(classID)
	if err != nil {
		return nil, err
	}

	assignments, err := s.repo.GetAssignments(classID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"class_id":    classID,
		"notices":     notices,
		"materials":   materials,
		"assignments": assignments,
	}, nil
}
