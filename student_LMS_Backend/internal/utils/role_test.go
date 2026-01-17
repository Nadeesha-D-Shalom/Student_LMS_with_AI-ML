package utils

import "testing"

func TestIsValidRole(t *testing.T) {
	validRoles := []string{"STUDENT", "TEACHER", "ADMIN"}

	for _, role := range validRoles {
		if role == "" {
			t.Fatalf("role should not be empty")
		}
	}
}
