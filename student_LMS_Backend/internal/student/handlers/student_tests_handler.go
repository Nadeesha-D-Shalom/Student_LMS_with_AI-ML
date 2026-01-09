package handlers

import (
	"net/http"
	"strconv"

	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

func GetStudentTests(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	svc := services.NewStudentTestsService()
	list, err := svc.List(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load tests"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": list})
}

func GetStudentTestDetail(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	svc := services.NewStudentTestsService()
	detail, err := svc.Detail(studentID, testID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, detail)
}

func StartStudentTest(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	svc := services.NewStudentTestsService()
	attempt, err := svc.Start(studentID, testID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

func GetStudentTestQuestions(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	svc := services.NewStudentTestsService()
	q, err := svc.Questions(studentID, testID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": q})
}

type saveAnswerReq struct {
	QuestionID     uint64 `json:"question_id" binding:"required"`
	SelectedOption string `json:"selected_option" binding:"required"`
}

func SaveStudentTestAnswer(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	var req saveAnswerReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	svc := services.NewStudentTestsService()
	if err := svc.SaveAnswer(studentID, testID, req.QuestionID, req.SelectedOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func SubmitStudentTest(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	svc := services.NewStudentTestsService()
	score, err := svc.Submit(studentID, testID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "score": score})
}

func GetStudentTestResult(c *gin.Context) {
	studentID := c.GetUint64("user_id")

	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid test id"})
		return
	}

	svc := services.NewStudentTestsService()
	data, err := svc.Result(studentID, testID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
