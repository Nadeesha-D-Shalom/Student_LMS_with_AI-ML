package repositories

import "database/sql"

type StudentLiveClassRepository struct {
	DB *sql.DB
}

func NewStudentLiveClassRepository(db *sql.DB) *StudentLiveClassRepository {
	return &StudentLiveClassRepository{DB: db}
}

func (r *StudentLiveClassRepository) Fetch(studentID uint64) (map[string]interface{}, error) {
	upcomingQuery := `
		SELECT
			lc.id,
			c.id AS class_id,
			c.class_name,
			lc.session_date,
			lc.start_time,
			lc.end_time,
			lc.meeting_url
		FROM live_classes lc
		JOIN classes c ON c.id = lc.class_id
		JOIN student_classes sc ON sc.class_id = c.id
		WHERE sc.student_id = ?
		  AND lc.session_date >= CURDATE()
		ORDER BY lc.session_date ASC
	`

	rows, err := r.DB.Query(upcomingQuery, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var upcoming []map[string]interface{}

	for rows.Next() {
		var (
			id          uint64
			classID     uint64
			className   string
			sessionDate string
			startTime   string
			endTime     string
			meetingURL  string
		)

		err := rows.Scan(
			&id,
			&classID,
			&className,
			&sessionDate,
			&startTime,
			&endTime,
			&meetingURL,
		)
		if err != nil {
			return nil, err
		}

		item := map[string]interface{}{
			"id":           id,
			"class_id":     classID,
			"class_name":   className,
			"session_date": sessionDate,
			"start_time":   startTime,
			"end_time":     endTime,
			"meeting_url":  meetingURL,
		}

		upcoming = append(upcoming, item)
	}

	return map[string]interface{}{
		"upcoming": upcoming,
	}, nil
}
