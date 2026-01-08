package repositories

import (
	"database/sql"
)

type StudentDashboardRepository struct {
	DB *sql.DB
}

func NewStudentDashboardRepository(db *sql.DB) *StudentDashboardRepository {
	return &StudentDashboardRepository{DB: db}
}

func (r *StudentDashboardRepository) GetStats(studentUserID uint64) (map[string]int, error) {
	stats := make(map[string]int)

	// ================= CLASSES =================
	var classes int
	err := r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM student_classes sc
		JOIN students s ON sc.student_id = s.user_id
		WHERE s.user_id = ?
	`, studentUserID).Scan(&classes)
	if err != nil {
		return nil, err
	}
	stats["classes"] = classes

	// ================= PENDING ASSIGNMENTS =================
	var pendingAssignments int
	err = r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM assignments a
		JOIN student_classes sc ON a.class_id = sc.class_id
		JOIN students st ON sc.student_id = st.user_id
		LEFT JOIN assignment_submissions sub
		  ON a.id = sub.assignment_id AND sub.student_id = st.user_id
		WHERE st.user_id = ? AND sub.assignment_id IS NULL
	`, studentUserID).Scan(&pendingAssignments)
	if err != nil {
		return nil, err
	}
	stats["pending_assignments"] = pendingAssignments

	// ================= UPCOMING LIVE CLASSES =================
	var upcomingLiveClasses int
	err = r.DB.QueryRow(`
		SELECT COUNT(*)
		FROM live_classes lc
		JOIN student_classes sc ON lc.class_id = sc.class_id
		JOIN students s ON sc.student_id = s.user_id
		WHERE s.user_id = ? AND lc.session_date >= CURDATE()
	`, studentUserID).Scan(&upcomingLiveClasses)
	if err != nil {
		return nil, err
	}
	stats["upcoming_live_classes"] = upcomingLiveClasses

	// ================= ANNOUNCEMENTS =================
	var announcements int
	err = r.DB.QueryRow(`
		SELECT COUNT(*) FROM announcements
	`).Scan(&announcements)
	if err != nil {
		return nil, err
	}
	stats["announcements"] = announcements

	return stats, nil
}
