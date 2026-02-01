package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const AI_URL = "http://127.0.0.1:8000/chat"

type AIRequest struct {
	Message string `json:"message"`
}

type AIResponse struct {
	AnswerMarkdown string `json:"answer_markdown"`
}

func AskAI(message string) (*AIResponse, error) {
	reqBody, _ := json.Marshal(AIRequest{
		Message: message,
	})

	client := &http.Client{
		Timeout: 180 * time.Second,
	}

	req, _ := http.NewRequest("POST", AI_URL, bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI service returned %d", resp.StatusCode)
	}

	var aiResp AIResponse
	if err := json.NewDecoder(resp.Body).Decode(&aiResp); err != nil {
		return nil, err
	}

	return &aiResp, nil
}
