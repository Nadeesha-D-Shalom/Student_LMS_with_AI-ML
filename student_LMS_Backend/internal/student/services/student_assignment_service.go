package services

import (
	"errors"
	"time"

	"student_LMS_Backend/internal/student/repositories"
)

type StudentAssignmentService struct {
	repo *repositories.StudentAssignmentRepository
}

func NewStudentAssignmentService() *StudentAssignmentService {
	return &StudentAssignmentService{
		repo: repositories.NewStudentAssignmentRepository(),
	}
}

/* ===============================
   LIST ASSIGNMENTS
================================ */

func (s *StudentAssignmentService) GetAllAssignments(
	studentID uint64,
	classID *uint64,
) ([]map[string]interface{}, error) {
	return s.repo.FetchStudentAssignments(studentID, classID)
}

/* ===============================
   ASSIGNMENT DETAIL
================================ */

func (s *StudentAssignmentService) GetAssignmentDetail(
	studentID, assignmentID uint64,
) (map[string]interface{}, error) {

	allowed, err := s.repo.CanAccessAssignment(studentID, assignmentID)
	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, errors.New("access denied")
	}

	return s.repo.FetchAssignmentDetail(studentID, assignmentID)
}

/* ===============================
   SUBMIT ASSIGNMENT (FIXED)
================================ */

func (s *StudentAssignmentService) SubmitAssignment(
	studentID, assignmentID uint64,
	filePath string,
) error {

	// Access check
	allowed, err := s.repo.CanAccessAssignment(studentID, assignmentID)
	if err != nil {
		return err
	}
	if !allowed {
		return errors.New("access denied")
	}

	// Get deadline info
	dueDate, dueTime, allowLate, err := s.repo.GetAssignmentDeadline(assignmentID)
	if err != nil {
		return err
	}

	/* ===============================
	   SAFE DATE PARSING
	================================ */

	var parsedDate time.Time

	// Case 1: RFC3339 (2026-01-30T00:00:00Z)
	parsedDate, err = time.Parse(time.RFC3339, dueDate)
	if err != nil {
		// Case 2: YYYY-MM-DD
		parsedDate, err = time.Parse("2006-01-02", dueDate)
		if err != nil {
			return err
		}
	}

	// Parse time (HH:MM:SS)
	parsedTime, err := time.Parse("15:04:05", dueTime)
	if err != nil {
		return err
	}

	// Combine date + time safely
	deadline := time.Date(
		parsedDate.Year(),
		parsedDate.Month(),
		parsedDate.Day(),
		parsedTime.Hour(),
		parsedTime.Minute(),
		parsedTime.Second(),
		0,
		time.Local,
	)

	/* ===============================
	   DEADLINE ENFORCEMENT
	================================ */

	if time.Now().After(deadline) && !allowLate {
		return errors.New("submission deadline has passed")
	}

	/* ===============================
	   SAVE SUBMISSION
	================================ */

	return s.repo.SaveSubmission(studentID, assignmentID, filePath)
}
