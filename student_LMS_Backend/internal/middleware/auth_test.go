package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestAuthMiddleware_NoToken(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.Use(AuthMiddleware())
	r.GET("/protected", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	req, _ := http.NewRequest("GET", "/protected", nil)
	resp := httptest.NewRecorder()

	r.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401, got %d", resp.Code)
	}
}
