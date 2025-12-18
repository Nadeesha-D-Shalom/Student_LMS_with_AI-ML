import re


def detect_marks(question: str) -> int | None:
    q = question.lower()

    # Detect patterns like "2 marks", "for 3 marks", "(4 marks)"
    m = re.search(r"(\d)\s*marks?", q)
    if m:
        return int(m.group(1))

    return None


def detect_question_type(question: str) -> str:
    q = question.lower().strip()

    # Definition-style
    definition_patterns = [
        "what is", "what are", "define", "meaning of",
        "what do you mean by", "state the meaning of",
        "give the meaning of", "write the definition of"
    ]
    if any(p in q for p in definition_patterns):
        return "definition"

    # Difference / compare
    diff_patterns = [
        "difference between", "differentiate", "compare", "contrast"
    ]
    if any(p in q for p in diff_patterns):
        return "difference"

    # List / name / mention
    list_patterns = [
        "list", "name", "mention", "identify", "state", "give examples"
    ]
    if any(p in q for p in list_patterns):
        return "list"

    # Explain
    explain_patterns = [
        "explain", "describe", "write short note", "discuss"
    ]
    if any(p in q for p in explain_patterns):
        return "explain"

    return "general"
