package repositories

import (
	"database/sql"
)

type StudentClassSchedule struct {
	DayOfWeek string `json:"day_of_week"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

type StudentClassItem struct {
	ClassID           uint64                 `json:"class_id"`
	ClassName         string                 `json:"class_name"`
	InstituteLocation string                 `json:"institute_location"`
	SubjectID         uint64                 `json:"subject_id"`
	SubjectName       string                 `json:"subject_name"`
	Grade             string                 `json:"grade"`
	TeacherID         uint64                 `json:"teacher_id"`
	TeacherName       string                 `json:"teacher_name"`
	Schedules         []StudentClassSchedule `json:"schedules"`
}

type StudentClassesRepository struct {
	DB *sql.DB
}

func NewStudentClassesRepository(db *sql.DB) *StudentClassesRepository {
	return &StudentClassesRepository{DB: db}
}

func (r *StudentClassesRepository) GetStudentClasses(studentUserID uint64) ([]StudentClassItem, error) {
	// Single query: fetch classes + schedule rows (one class can have multiple schedules)
	rows, err := r.DB.Query(`
		SELECT
			c.id AS class_id,
			c.class_name,
			c.institute_location,

			su.id AS subject_id,
			su.name AS subject_name,
			su.grade,

			t.user_id AS teacher_id,
			CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,

			COALESCE(cs.day_of_week, '') AS day_of_week,
			COALESCE(TIME_FORMAT(cs.start_time, '%H:%i'), '') AS start_time,
			COALESCE(TIME_FORMAT(cs.end_time, '%H:%i'), '') AS end_time

		FROM student_classes sc
		JOIN students st ON sc.student_id = st.user_id
		JOIN classes c ON sc.class_id = c.id
		JOIN subjects su ON c.subject_id = su.id
		JOIN teachers t ON c.teacher_id = t.user_id
		LEFT JOIN class_schedules cs ON cs.class_id = c.id

		WHERE st.user_id = ?
		ORDER BY c.id ASC
	`, studentUserID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Group schedules by class_id (avoid duplicate class objects)
	byClassID := make(map[uint64]*StudentClassItem)
	order := make([]uint64, 0)

	for rows.Next() {
		var (
			classID   uint64
			className string
			location  string

			subjectID   uint64
			subjectName string
			grade       string

			teacherID   uint64
			teacherName string

			dayOfWeek string
			startTime string
			endTime   string
		)

		if err := rows.Scan(
			&classID,
			&className,
			&location,
			&subjectID,
			&subjectName,
			&grade,
			&teacherID,
			&teacherName,
			&dayOfWeek,
			&startTime,
			&endTime,
		); err != nil {
			return nil, err
		}

		item, exists := byClassID[classID]
		if !exists {
			byClassID[classID] = &StudentClassItem{
				ClassID:           classID,
				ClassName:         className,
				InstituteLocation: location,
				SubjectID:         subjectID,
				SubjectName:       subjectName,
				Grade:             grade,
				TeacherID:         teacherID,
				TeacherName:       teacherName,
				Schedules:         []StudentClassSchedule{},
			}
			order = append(order, classID)
			item = byClassID[classID]
		}

		// Add schedule only if exists (LEFT JOIN can return empty strings)
		if dayOfWeek != "" && startTime != "" && endTime != "" {
			item.Schedules = append(item.Schedules, StudentClassSchedule{
				DayOfWeek: dayOfWeek,
				StartTime: startTime,
				EndTime:   endTime,
			})
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Keep deterministic ordering
	out := make([]StudentClassItem, 0, len(order))
	for _, id := range order {
		out = append(out, *byClassID[id])
	}

	return out, nil
}
