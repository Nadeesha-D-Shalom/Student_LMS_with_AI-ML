package ai

import (
	"net/http"

	"student_LMS_Backend/internal/ai/service"

	"github.com/gin-gonic/gin"
)

type AIRequest struct {
	Message string `json:"message"`
}

func RegisterAIRoutes(r *gin.RouterGroup) {
	r.POST("/ai/chat", func(c *gin.Context) {
		var req AIRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.Message == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Message is required"})
			return
		}

		response, err := service.AskAI(req.Message)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, response)
	})
}
