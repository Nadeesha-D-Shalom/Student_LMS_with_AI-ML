package handlers

import (
	"net/http"
	"student_LMS_Backend/internal/student/services"

	"github.com/gin-gonic/gin"
)

/*
====================================================
STUDENT PROFILE
====================================================
*/

// GET /api/student/profile
func GetStudentProfile(c *gin.Context) {
	userID := c.GetUint64("user_id")

	service := services.NewStudentProfileService()
	data, err := service.Get(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load profile",
		})
		return
	}

	c.JSON(http.StatusOK, data)
}

/*
====================================================
UPDATE PROFILE (NO EMAIL / FIRST NAME)
====================================================
*/

type updateStudentProfileReq struct {
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	AvatarURL string `json:"avatar_url"`
}

// PUT /api/student/profile
func UpdateStudentProfile(c *gin.Context) {
	userID := c.GetUint64("user_id")

	var req updateStudentProfileReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid payload",
		})
		return
	}

	service := services.NewStudentProfileService()
	if err := service.Update(
		userID,
		req.LastName,
		req.Phone,
		req.Address,
		req.AvatarURL,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}

/*
====================================================
CHANGE PASSWORD
====================================================
*/

type changePasswordReq struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}

// POST /api/student/change-password
func ChangeStudentPassword(c *gin.Context) {
	userID := c.GetUint64("user_id")

	var req changePasswordReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "current_password and new_password are required",
		})
		return
	}

	service := services.NewStudentProfileService()
	if err := service.ChangePassword(
		userID,
		req.CurrentPassword,
		req.NewPassword,
	); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
