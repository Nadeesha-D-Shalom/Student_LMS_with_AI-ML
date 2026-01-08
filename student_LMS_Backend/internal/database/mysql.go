package database

import (
	"database/sql"
	"fmt"
	"log"

	"student_LMS_Backend/internal/config"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectMySQL(cfg *config.Config) {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		cfg.DBUser,
		cfg.DBPass,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("MySQL open failed:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("MySQL connection failed:", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)

	DB = db

	log.Println("MySQL connected successfully")
}
