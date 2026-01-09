package services

import (
	"errors"
	"student_LMS_Backend/internal/student/repositories"
)

type StudentTestsService struct {
	repo *repositories.StudentTestsRepository
}

func NewStudentTestsService() *StudentTestsService {
	return &StudentTestsService{
		repo: repositories.NewStudentTestsRepository(),
	}
}

func (s *StudentTestsService) List(studentID uint64) ([]repositories.TestListItem, error) {
	return s.repo.ListStudentTests(studentID)
}

func (s *StudentTestsService) Detail(studentID, testID uint64) (*repositories.TestDetail, error) {
	allowed, err := s.repo.CanAccessTest(studentID, testID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("access denied")
	}

	return s.repo.GetTestDetail(studentID, testID)
}

func (s *StudentTestsService) Start(studentID, testID uint64) (*repositories.AttemptInfo, error) {
	allowed, err := s.repo.CanAccessTest(studentID, testID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("access denied")
	}

	detail, err := s.repo.GetTestDetail(studentID, testID)
	if err != nil {
		return nil, err
	}

	dbNow, err := s.repo.GetDBTime()
	if err != nil {
		return nil, err
	}

	if dbNow.Before(detail.StartAt) {
		return nil, errors.New("test not started yet")
	}
	if dbNow.After(detail.EndAt) {
		return nil, errors.New("test has ended")
	}

	return s.repo.CreateOrResumeAttempt(studentID, testID)
}

func (s *StudentTestsService) Questions(studentID, testID uint64) ([]repositories.StudentQuestion, error) {
	allowed, err := s.repo.CanAccessTest(studentID, testID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, errors.New("access denied")
	}

	attempt, err := s.repo.GetAttempt(studentID, testID)
	if err != nil {
		return nil, err
	}
	if attempt == nil || attempt.Status == "NOT_STARTED" {
		return nil, errors.New("start the test first")
	}
	if attempt.Status == "SUBMITTED" {
		return nil, errors.New("test already submitted")
	}
	if attempt.Status != "IN_PROGRESS" {
		return nil, errors.New("test is not in progress")
	}

	return s.repo.ListQuestions(testID)
}

func (s *StudentTestsService) SaveAnswer(studentID, testID, questionID uint64, selectedOption string) error {
	attempt, err := s.repo.GetAttempt(studentID, testID)
	if err != nil {
		return err
	}
	if attempt == nil {
		return errors.New("start the test first")
	}
	if attempt.Status != "IN_PROGRESS" {
		return errors.New("test is not in progress")
	}

	switch selectedOption {
	case "A", "B", "C", "D":
	default:
		return errors.New("invalid option")
	}

	return s.repo.SaveAnswer(attempt.AttemptID, questionID, selectedOption)
}

func (s *StudentTestsService) Submit(studentID, testID uint64) (int, error) {
	attempt, err := s.repo.GetAttempt(studentID, testID)
	if err != nil {
		return 0, err
	}
	if attempt == nil {
		return 0, errors.New("start the test first")
	}
	if attempt.Status != "IN_PROGRESS" {
		return 0, errors.New("test is not in progress")
	}

	score, err := s.repo.GradeAttempt(attempt.AttemptID, testID)
	if err != nil {
		return 0, err
	}

	if err := s.repo.SubmitAttempt(attempt.AttemptID); err != nil {
		return 0, err
	}

	return score, nil
}

func (s *StudentTestsService) Result(studentID, testID uint64) (map[string]interface{}, error) {
	detail, err := s.repo.GetTestDetail(studentID, testID)
	if err != nil {
		return nil, err
	}

	if !detail.ShowResults {
		return nil, errors.New("results are not available for this test")
	}
	if detail.AttemptStatus != "SUBMITTED" {
		return nil, errors.New("test not submitted yet")
	}

	return map[string]interface{}{
		"test_id":     detail.ID,
		"title":       detail.Title,
		"score":       detail.Score,
		"total_marks": detail.TotalMarks,
		"submitted":   true,
	}, nil
}
