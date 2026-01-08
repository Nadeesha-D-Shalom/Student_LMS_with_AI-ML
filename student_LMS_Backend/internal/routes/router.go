package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"student_LMS_Backend/internal/handlers"
	"student_LMS_Backend/internal/middleware"
)

func EmptyList(c *gin.Context) {
	c.JSON(http.StatusOK, []interface{}{})
}

func SetupRouter() *gin.Engine {
	r := gin.New()

	// ===================== CORS =====================
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	// =================================================

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// ===================== STATIC FILES =====================
	// THIS ENABLES:
	// http://localhost:8080/uploads/assignments/<file>.pdf
	r.Static("/uploads", "./uploads")
	// ========================================================

	// ===================== PUBLIC ROUTES =====================
	r.GET("/health", handlers.HealthCheck)
	r.POST("/auth/register", handlers.Register)
	r.POST("/auth/login", handlers.Login)
	// =========================================================

	// ===================== PROTECTED ROUTES =====================
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	api.GET("/me", handlers.GetMe)

	// ---------- Dashboards ----------
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

	// ---------- Student Classes ----------
	api.GET(
		"/student/classes",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentClasses,
	)

	api.GET(
		"/student/classes/:classId/grades",
		middleware.RequireRole("STUDENT"),
		handlers.GetClassGrades,
	)

	api.GET(
		"/student/classes/:classId/grade/:gradeId/workspace",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentWorkspace,
	)

	// ---------- Assignments ----------
	api.GET(
		"/student/assignments",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentAssignments,
	)

	api.GET(
		"/student/assignments/:assignmentId",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentAssignmentDetail,
	)

	api.POST(
		"/student/assignments/:assignmentId/submit",
		middleware.RequireRole("STUDENT"),
		handlers.SubmitStudentAssignment,
	)

	api.GET(
		"/student/live-classes",
		middleware.RequireRole("STUDENT"),
		handlers.StudentLiveClasses,
	)
	// ---------- Student Profile ----------
	api.GET(
		"/student/profile",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentProfile,
	)

	api.PUT(
		"/student/profile",
		middleware.RequireRole("STUDENT"),
		handlers.UpdateStudentProfile,
	)

	api.POST(
		"/student/change-password",
		middleware.RequireRole("STUDENT"),
		handlers.ChangeStudentPassword,
	)

	// ---------- Student Settings ----------
	api.GET(
		"/student/settings",
		middleware.RequireRole("STUDENT"),
		handlers.GetStudentSettings,
	)

	api.PUT(
		"/student/settings",
		middleware.RequireRole("STUDENT"),
		handlers.UpdateStudentSettings,
	)

	return r
}
