package config

import (
	"os"
)

type Config struct {
	AppName string
	AppEnv  string
	AppPort string

	DBDriver string
	DBHost   string
	DBPort   string
	DBName   string
	DBUser   string
	DBPass   string
}

func Load() *Config {
	return &Config{
		AppName: os.Getenv("APP_NAME"),
		AppEnv:  os.Getenv("APP_ENV"),
		AppPort: os.Getenv("APP_PORT"),

		DBDriver: os.Getenv("DB_DRIVER"),
		DBHost:   os.Getenv("DB_HOST"),
		DBPort:   os.Getenv("DB_PORT"),
		DBName:   os.Getenv("DB_NAME"),
		DBUser:   os.Getenv("DB_USER"),
		DBPass:   os.Getenv("DB_PASSWORD"),
	}
}
