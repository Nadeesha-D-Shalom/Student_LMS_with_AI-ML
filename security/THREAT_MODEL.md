# Threat Model – Student LMS with AI/ML

## Assets
- Authentication tokens (JWT)
- User personal data
- Academic records
- AI inference endpoints
- Uploaded files

## Entry Points
- Login API
- Role-based APIs
- File upload endpoints
- AI chat endpoint
- Frontend routes

## Threat Scenarios
- Unauthorized access
- Role escalation
- Token replay
- Injection attacks
- File upload abuse
- Prompt injection

## High-Risk Areas
- Auth middleware
- Token storage
- File handling
- AI input processing
