package repositories

import "database/sql"

type TeacherStudentRepository struct {
	DB *sql.DB
}

func NewTeacherStudentRepository(db *sql.DB) *TeacherStudentRepository {
	return &TeacherStudentRepository{DB: db}
}

func (r *TeacherStudentRepository) List() ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT 
			user_id,
			first_name,
			last_name,
			personal_mobile,
			parent_mobile,
			grade,
			age
		FROM students
		ORDER BY first_name
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []map[string]interface{}

	for rows.Next() {
		var (
			id     uint64
			fname  string
			lname  string
			mobile string
			parent string
			grade  int
			age    int
		)

		if err := rows.Scan(&id, &fname, &lname, &mobile, &parent, &grade, &age); err != nil {
			return nil, err
		}

		students = append(students, map[string]interface{}{
			"user_id":         id,
			"first_name":      fname,
			"last_name":       lname,
			"personal_mobile": mobile,
			"parent_mobile":   parent,
			"grade":           grade,
			"age":             age,
		})
	}

	return students, nil
}

func (r *TeacherStudentRepository) GetByID(studentID uint64) (map[string]interface{}, error) {
	row := r.DB.QueryRow(`
		SELECT 
			user_id,
			first_name,
			last_name,
			personal_mobile,
			parent_mobile,
			address,
			grade,
			age,
			institute_location,
			free_card
		FROM students
		WHERE user_id = ?
	`, studentID)

	var s map[string]interface{} = make(map[string]interface{})

	var (
		id      uint64
		fname   string
		lname   string
		mobile  string
		parent  string
		address string
		grade   int
		age     int
		inst    string
		free    bool
	)

	if err := row.Scan(&id, &fname, &lname, &mobile, &parent, &address, &grade, &age, &inst, &free); err != nil {
		return nil, err
	}

	s["user_id"] = id
	s["first_name"] = fname
	s["last_name"] = lname
	s["personal_mobile"] = mobile
	s["parent_mobile"] = parent
	s["address"] = address
	s["grade"] = grade
	s["age"] = age
	s["institute_location"] = inst
	s["free_card"] = free

	return s, nil
}
