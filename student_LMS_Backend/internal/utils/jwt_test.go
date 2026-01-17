package utils

import (
	"os"
	"testing"
)

func TestGenerateToken(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret")

	token, err := GenerateToken(1, "student")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if token == "" {
		t.Fatal("expected token, got empty string")
	}
}
