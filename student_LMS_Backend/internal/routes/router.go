package routes

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"student_LMS_Backend/internal/database"

	handlers2 "student_LMS_Backend/internal/student/handlers"
	studentRepos "student_LMS_Backend/internal/student/repositories"

	teacherHandlers "student_LMS_Backend/internal/teacher/handlers"
	teacherRepos "student_LMS_Backend/internal/teacher/repositories"

	"student_LMS_Backend/internal/ai"
	"student_LMS_Backend/internal/handlers"
	"student_LMS_Backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
	// ===============================================

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// =====================================================
	// FILE SERVER (PDF / DOC / SLIDE SAFE SERVING)
	// =====================================================
	r.GET("/uploads/*filepath", func(c *gin.Context) {
		relPath := strings.TrimPrefix(c.Param("filepath"), "/")

		baseDir, _ := filepath.Abs("uploads")
		requestedPath := filepath.Join(baseDir, relPath)
		requestedPath, _ = filepath.Abs(requestedPath)

		// Block path traversal
		if !strings.HasPrefix(requestedPath, baseDir) {
			c.Status(http.StatusForbidden)
			return
		}

		if _, err := os.Stat(requestedPath); os.IsNotExist(err) {
			c.Status(http.StatusNotFound)
			return
		}

		ext := strings.ToLower(filepath.Ext(requestedPath))
		switch ext {
		case ".pdf":
			c.Header("Content-Type", "application/pdf")
			c.Header("Content-Disposition", "inline")
		case ".doc", ".docx":
			c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
			c.Header("Content-Disposition", "inline")
		case ".ppt", ".pptx":
			c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation")
			c.Header("Content-Disposition", "inline")
		default:
			c.Header("Content-Disposition", "attachment")
		}

		c.File(requestedPath)
	})
	// =====================================================

	// ===================== PUBLIC ROUTES =====================
	r.GET("/health", handlers.HealthCheck)
	r.POST("/auth/register", handlers.Register)

	loginLimiter := middleware.NewRateLimiter(5, time.Minute)

	r.POST(
		"/auth/login",
		middleware.RateLimitMiddleware(loginLimiter, func(c *gin.Context) string {
			return c.ClientIP()
		}),
		handlers.Login,
	)
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

	// ---------- Student Notices ----------
	studentNoticeRepo := studentRepos.NewStudentNoticeRepository(database.DB)
	studentNoticeHandler := handlers2.NewStudentNoticeHandler(studentNoticeRepo)

	api.GET(
		"/student/notices",
		middleware.RequireRole("STUDENT"),
		studentNoticeHandler.List,
	)

	// ---------- Student Materials ----------
	studentMaterialRepo := studentRepos.NewStudentMaterialRepository(database.DB)
	studentMaterialHandler := handlers2.NewStudentMaterialHandler(studentMaterialRepo)

	api.GET(
		"/student/materials",
		middleware.RequireRole("STUDENT"),
		studentMaterialHandler.List,
	)

	// ---------- Student Week Notes ----------
	studentWeekNoteRepo := studentRepos.NewStudentWeekNoteRepository(database.DB)
	studentWeekNoteHandler := handlers2.NewStudentWeekNoteHandler(studentWeekNoteRepo)

	api.GET(
		"/student/weeks/notes",
		middleware.RequireRole("STUDENT"),
		studentWeekNoteHandler.List,
	)

	// ---------- AI Assistant ----------
	ai.RegisterAIRoutes(api)

	// ---------- Teacher Classes ----------
	teacherClassRepo := teacherRepos.NewTeacherClassRepository(database.DB)
	teacherClassHandler := teacherHandlers.NewTeacherClassHandler(teacherClassRepo)

	api.GET(
		"/teacher/classes",
		middleware.RequireRole("TEACHER"),
		teacherClassHandler.List,
	)

	api.POST(
		"/teacher/classes",
		middleware.RequireRole("TEACHER"),
		teacherClassHandler.Create,
	)

	// ---------- Teacher Notices ----------
	teacherNoticeRepo := teacherRepos.NewTeacherNoticeRepository(database.DB)
	teacherNoticeHandler := teacherHandlers.NewTeacherNoticeHandler(teacherNoticeRepo)

	api.POST(
		"/teacher/notices",
		middleware.RequireRole("TEACHER"),
		teacherNoticeHandler.Create,
	)

	api.GET(
		"/teacher/notices",
		middleware.RequireRole("TEACHER"),
		teacherNoticeHandler.List,
	)

	api.PUT(
		"/teacher/notices/:id",
		middleware.RequireRole("TEACHER"),
		teacherNoticeHandler.Update,
	)

	api.DELETE(
		"/teacher/notices/:id",
		middleware.RequireRole("TEACHER"),
		teacherNoticeHandler.Delete,
	)

	// ---------- Teacher Materials ----------
	teacherMaterialRepo := teacherRepos.NewTeacherMaterialRepository(database.DB)
	teacherMaterialHandler := teacherHandlers.NewTeacherMaterialHandler(teacherMaterialRepo)

	api.POST(
		"/teacher/materials",
		middleware.RequireRole("TEACHER"),
		teacherMaterialHandler.Upload,
	)

	api.GET(
		"/teacher/materials",
		middleware.RequireRole("TEACHER"),
		teacherMaterialHandler.List,
	)

	api.PUT(
		"/teacher/materials/:id",
		middleware.RequireRole("TEACHER"),
		teacherMaterialHandler.Update,
	)

	api.DELETE(
		"/teacher/materials/:id",
		middleware.RequireRole("TEACHER"),
		teacherMaterialHandler.Delete,
	)

	// ---------- Week Notes ----------
	weekNoteRepo := teacherRepos.NewWeekNoteRepository(database.DB)
	weekNoteHandler := teacherHandlers.NewWeekNoteHandler(weekNoteRepo)

	api.GET(
		"/teacher/weeks/notes",
		middleware.RequireRole("TEACHER"),
		weekNoteHandler.List,
	)

	api.PUT(
		"/teacher/weeks/note",
		middleware.RequireRole("TEACHER"),
		weekNoteHandler.Upsert,
	)

	api.DELETE(
		"/teacher/weeks/note/:id",
		middleware.RequireRole("TEACHER"),
		weekNoteHandler.Delete,
	)

	// ---------- Week Rename ----------
	weekTitleRepo := teacherRepos.NewWeekTitleRepository(database.DB)
	weekTitleHandler := teacherHandlers.NewWeekTitleHandler(weekTitleRepo)

	api.PUT(
		"/teacher/weeks/rename",
		middleware.RequireRole("TEACHER"),
		weekTitleHandler.Rename,
	)

	// ---------- Teacher Students ----------
	teacherStudentRepo := teacherRepos.NewTeacherStudentRepository(database.DB)
	teacherStudentHandler := teacherHandlers.NewTeacherStudentHandler(teacherStudentRepo)

	api.GET(
		"/teacher/students",
		middleware.RequireRole("TEACHER"),
		teacherStudentHandler.List,
	)

	api.GET(
		"/teacher/students/:id",
		middleware.RequireRole("TEACHER"),
		teacherStudentHandler.Get,
	)

	api.PUT(
		"/teacher/assignments/:assignmentId/status",
		middleware.RequireRole("TEACHER"),
		teacherHandlers.ToggleAssignmentStatus,
	)
	api.DELETE(
		"/student/assignments/:assignmentId/submission",
		middleware.RequireRole("STUDENT"),
		handlers2.RemoveStudentAssignmentSubmission,
	)

	// ---------- Teacher Assignments ----------
	teacherAssignmentRepo := teacherRepos.NewTeacherAssignmentRepository(database.DB)
	teacherAssignmentHandler := teacherHandlers.NewTeacherAssignmentHandler(teacherAssignmentRepo)

	api.GET(
		"/teacher/assignments",
		middleware.RequireRole("TEACHER"),
		teacherAssignmentHandler.List,
	)

	api.POST(
		"/teacher/assignments",
		middleware.RequireRole("TEACHER"),
		teacherAssignmentHandler.Create,
	)

	api.PUT(
		"/teacher/assignments/:assignmentId",
		middleware.RequireRole("TEACHER"),
		teacherAssignmentHandler.Update,
	)

	api.DELETE(
		"/teacher/assignments/:assignmentId",
		middleware.RequireRole("TEACHER"),
		teacherAssignmentHandler.Delete,
	)

	// ---------- Teacher Messages ----------
	api.GET(
		"/teacher/messages",
		middleware.RequireRole("TEACHER"),
		teacherHandlers.TeacherInbox,
	)

	api.GET(
		"/teacher/messages/:threadId",
		middleware.RequireRole("TEACHER"),
		teacherHandlers.TeacherGetThread,
	)

	api.POST(
		"/teacher/messages/:threadId/reply",
		middleware.RequireRole("TEACHER"),
		teacherHandlers.TeacherReply,
	)

	api.POST(
		"/teacher/messages/:threadId/close",
		middleware.RequireRole("TEACHER"),
		teacherHandlers.TeacherCloseThread,
	)

	// ---------- Student Messages (New Thread + Stack) ----------
	api.GET(
		"/student/messages",
		middleware.RequireRole("STUDENT"),
		handlers2.StudentInbox,
	)

	api.GET(
		"/student/messages/:threadId",
		middleware.RequireRole("STUDENT"),
		handlers2.StudentGetThread,
	)

	api.POST(
		"/student/messages",
		middleware.RequireRole("STUDENT"),
		handlers2.StudentCreateThread,
	)

	api.POST(
		"/student/messages/:threadId/reply",
		middleware.RequireRole("STUDENT"),
		handlers2.StudentReply,
	)

	return r
}
