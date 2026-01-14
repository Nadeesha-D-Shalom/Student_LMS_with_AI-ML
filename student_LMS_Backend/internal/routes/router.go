package routes

import (
	"net/http"
	"student_LMS_Backend/internal/database"
	handlers2 "student_LMS_Backend/internal/student/handlers"
	"student_LMS_Backend/internal/student/repositories"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"student_LMS_Backend/internal/handlers"
	"student_LMS_Backend/internal/middleware"

	"student_LMS_Backend/internal/ai"
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
		handlers2.StudentDashboard,
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
		handlers2.GetStudentClasses,
	)

	api.GET(
		"/student/classes/:classId/grades",
		middleware.RequireRole("STUDENT"),
		handlers2.GetClassGrades,
	)

	api.GET(
		"/student/classes/:classId/grade/:gradeId/workspace",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentWorkspace,
	)

	// ---------- Assignments ----------
	api.GET(
		"/student/assignments",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentAssignments,
	)

	api.GET(
		"/student/assignments/:assignmentId",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentAssignmentDetail,
	)

	api.POST(
		"/student/assignments/:assignmentId/submit",
		middleware.RequireRole("STUDENT"),
		handlers2.SubmitStudentAssignment,
	)

	api.GET(
		"/student/live-classes",
		middleware.RequireRole("STUDENT"),
		handlers2.StudentLiveClasses,
	)
	// ---------- Student Profile ----------
	api.GET(
		"/student/profile",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentProfile,
	)

	api.PUT(
		"/student/profile",
		middleware.RequireRole("STUDENT"),
		handlers2.UpdateStudentProfile,
	)

	api.POST(
		"/student/change-password",
		middleware.RequireRole("STUDENT"),
		handlers2.ChangeStudentPassword,
	)

	// ---------- Student Settings ----------
	api.GET(
		"/student/settings",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentSettings,
	)

	api.PUT(
		"/student/settings",
		middleware.RequireRole("STUDENT"),
		handlers2.UpdateStudentSettings,
	)
	// ---------------- ANNOUNCEMENTS ----------------
	announcementRepo := repositories.NewAnnouncementRepository(database.DB)
	announcementHandler := handlers2.NewAnnouncementHandler(announcementRepo)

	/* -------- STUDENT -------- */
	api.GET(
		"/student/announcements",
		middleware.RequireRole("STUDENT"),
		announcementHandler.GetStudentAnnouncements,
	)

	/* -------- STAFF (TEACHER / ADMIN / IT_ADMIN) -------- */
	api.GET(
		"/staff/announcements",
		middleware.RequireRole("TEACHER", "ADMIN", "IT_ADMIN"),
		announcementHandler.GetAllAnnouncements,
	)

	api.POST(
		"/staff/announcements",
		middleware.RequireRole("TEACHER", "ADMIN", "IT_ADMIN"),
		announcementHandler.CreateAnnouncement,
	)

	api.PUT(
		"/staff/announcements/:id",
		middleware.RequireRole("TEACHER", "ADMIN", "IT_ADMIN"),
		announcementHandler.UpdateAnnouncement,
	)

	api.DELETE(
		"/staff/announcements/:id",
		middleware.RequireRole("TEACHER", "ADMIN", "IT_ADMIN"),
		announcementHandler.DeleteAnnouncement,
	)

	// ---------- Student Messages ----------
	api.GET(
		"/student/messages",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentMessages,
	)

	api.GET(
		"/student/messages/:id",
		middleware.RequireRole("STUDENT"),
		handlers2.GetStudentMessageThread,
	)

	api.GET(
		"/student/messages-unread-count",
		middleware.RequireRole("STUDENT"),
		handlers2.GetUnreadMessageCount,
	)

	api.POST(
		"/student/messages",
		middleware.RequireRole("STUDENT"),
		handlers2.CreateStudentMessage,
	)

	// ---------- AI Assistant ----------
	ai.RegisterAIRoutes(api)

	return r
}
