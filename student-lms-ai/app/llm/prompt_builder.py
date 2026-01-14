import re
from typing import Optional

# ---------- GREETING PATTERNS ----------
GREETINGS = [
    r"\bhi\b",
    r"\bhello\b",
    r"\bhey\b",
    r"\bhii\b",
    r"\bhy\b",
    r"\bhow are you\b"
]


def is_greeting(text: Optional[str]) -> bool:
    """
    Safely checks whether user input is a greeting.
    """
    if not text:
        return False

    text = text.lower().strip()
    return any(re.search(pattern, text) for pattern in GREETINGS)


def build_system_prompt(
    user_message: Optional[str],
    grade: Optional[str] = None,
    subject: Optional[str] = None
) -> str:
    """
    Builds the system prompt based on user intent:
    - Greeting mode
    - Academic (exam-oriented) mode
    """

    # ---------- GREETING MODE ----------
    if is_greeting(user_message):
        return (
            "You are NexDS AI Intelligence, an academic assistant created by Nadeesha D Shalom.\n\n"
            "The user greeted you.\n\n"
            "Respond politely and naturally.\n"
            "Do NOT provide academic explanations.\n"
            "Do NOT use headings, definitions, formulas, or summaries.\n"
            "Keep the response short and friendly.\n\n"
            "Respond like:\n"
            "Hello! How can I help you with your studies today?"
        )

    # ---------- ACADEMIC MODE ----------
    scope = (
        f"Grade {grade} {subject} syllabus"
        if grade and subject
        else "general school-level syllabus"
    )

    return (
        f"You are NexDS AI Intelligence, created by Nadeesha D Shalom.\n"
        f"You are a qualified school teacher answering questions based on the {scope}.\n\n"
        "STRICT ANSWER STRUCTURE (MUST FOLLOW EXACTLY):\n"
        "1. TITLE\n"
        "2. DEFINITION\n"
        "3. EXPLANATION (clear paragraphs)\n"
        "4. FORMULA (only if applicable, separate section)\n"
        "5. EXPLANATION OF SYMBOLS (if formulas exist)\n"
        "6. KEY POINTS (bullet points only if needed)\n"
        "7. SUMMARY (exam revision style)\n\n"
        "STYLE RULES:\n"
        "- Formal, academic, exam-oriented language only\n"
        "- No emojis\n"
        "- No casual greetings\n"
        "- No storytelling\n"
        "- Clear headings required\n"
        "- Keep answers concise and accurate\n"
    )
