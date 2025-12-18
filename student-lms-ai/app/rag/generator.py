from app.rag.text_utils import (
    split_sentences,
    extract_keywords,
    select_relevant_sentences,
    normalize_context
)
from app.rag.question_utils import (
    detect_question_type,
    detect_marks
)


def generate_answer(question: str, context: list[str]) -> dict:
    normalized = normalize_context(context)

    if not normalized:
        return {
            "type": "explanation",
            "concept": "general",
            "grade": 10,
            "subject": "Science",
            "marks": None,
            "points": [],
            "text": "No relevant syllabus content found."
        }

    combined_text = " ".join(normalized)
    sentences = split_sentences(combined_text)

    if not sentences:
        return {
            "type": "explanation",
            "concept": "general",
            "grade": 10,
            "subject": "Science",
            "marks": None,
            "points": [],
            "text": "No relevant syllabus content found."
        }

    q_type = detect_question_type(question)
    marks = detect_marks(question)

    keywords = extract_keywords(question)

    # Universal bullet count logic (exam-friendly)
    if marks == 1:
        limit = 1
    elif marks == 2:
        limit = 2
    elif marks in (3, 4):
        limit = 3
    else:
        limit = 3

    bullets = select_relevant_sentences(
        sentences=sentences,
        keywords=keywords,
        limit=limit
    )

    # Final fallback (never empty)
    if not bullets:
        bullets = sentences[:limit]

    # Output format: always UI-ready JSON
    return {
        "type": "exam" if q_type != "explain" else "explanation",
        "concept": q_type,
        "grade": 10,
        "subject": "Science",
        "marks": marks,
        "points": bullets,
        "text": " ".join(bullets)
    }
