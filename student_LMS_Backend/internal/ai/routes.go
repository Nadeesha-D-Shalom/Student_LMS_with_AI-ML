package ai

import (
	"fmt"
	"net/http"
	"time"

	"student_LMS_Backend/internal/ai/service"
	"student_LMS_Backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

type AIRequest struct {
	Message string `json:"message"`
}

func RegisterAIRoutes(r *gin.RouterGroup) {
	aiLimiter := middleware.NewRateLimiter(10, time.Minute)

	r.POST(
		"/ai/chat",
		middleware.RateLimitMiddleware(aiLimiter, func(c *gin.Context) string {
			uid := c.GetUint64("user_id")
			if uid != 0 {
				return fmt.Sprintf("uid:%d", uid)
			}
			return c.ClientIP()
		}),
		func(c *gin.Context) {
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
		},
	)
}
