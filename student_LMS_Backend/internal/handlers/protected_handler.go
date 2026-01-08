package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func StudentProtectedTest(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Protected route working",
	})
}

func AdminDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome Admin",
	})
}
