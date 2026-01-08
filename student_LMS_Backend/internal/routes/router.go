package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"student_LMS_Backend/internal/handlers"
	"student_LMS_Backend/internal/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	// ================= CORS (CRITICAL FOR FRONTEND) =================
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	// ================================================================

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// ================= PUBLIC ROUTES =================
	r.GET("/health", handlers.HealthCheck)
	r.POST("/auth/register", handlers.Register)
	r.POST("/auth/login", handlers.Login)

	// ================= PROTECTED ROUTES =================
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	// Logged-in user profile
	api.GET("/me", handlers.GetMe)

	// Role-based dashboards
	api.GET(
		"/student/dashboard",
		middleware.RequireRole("STUDENT"),
		handlers.StudentDashboard,
	)

	api.GET(
		"/admin/dashboard",
		middleware.RequireRole("ADMIN"),
		handlers.AdminDashboard,
	)
	api.GET(
		"/student/classes",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentClasses,
	)

	return r
}
