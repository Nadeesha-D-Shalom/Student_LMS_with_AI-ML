package handlers

import (
	"net/http"

	"student_LMS_Backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetStudentSettings(c *gin.Context) {
	userID := c.GetUint64("user_id")

	service := services.NewStudentSettingsService()
	data, err := service.Get(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load settings"})
		return
	}

	c.JSON(http.StatusOK, data)
}

type updateStudentSettingsReq struct {
	EmailNotifications bool   `json:"email_notifications"`
	SmsNotifications   bool   `json:"sms_notifications"`
	DarkMode           bool   `json:"dark_mode"`
	Language           string `json:"language"`
}

func UpdateStudentSettings(c *gin.Context) {
	userID := c.GetUint64("user_id")

	var req updateStudentSettingsReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	service := services.NewStudentSettingsService()
	if err := service.Update(userID, req.EmailNotifications, req.SmsNotifications, req.DarkMode, req.Language); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
