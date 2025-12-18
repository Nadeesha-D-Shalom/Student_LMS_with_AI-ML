import re

JUNK_PREFIXES = (
    "grade", "chapter", "unit", "topic", "examples", "summary"
)

STOP_WORDS = {
    # grammar
    "what", "is", "are", "was", "were", "the", "a", "an", "and", "or", "to",
    "of", "in", "on", "for", "with", "from", "by", "as", "at", "into",

    # question words
    "how", "why", "when", "where", "which", "who", "whom", "whose",

    # exam verbs
    "define", "explain", "describe", "state", "give", "write", "list",
    "mention", "outline", "identify", "name",

    # comparison
    "difference", "between", "compare", "contrast",

    # auxiliaries
    "do", "does", "did", "can", "could", "should", "would", "may", "might"
}


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text)
    return [clean_text(p) for p in parts if p.strip()]


def extract_keywords(question: str) -> list[str]:
    words = re.findall(r"[a-zA-Z]+", question.lower())
    return [w for w in words if w not in STOP_WORDS and len(w) >= 3]


def is_valid_sentence(sentence: str) -> bool:
    s = sentence.lower()

    if s.startswith(JUNK_PREFIXES):
        return False

    if s.startswith("examples"):
        return False

    if ":" in s and len(s.split()) < 8:
        return False

    return True


def select_relevant_sentences(
    sentences: list[str],
    keywords: list[str],
    limit: int = 2
) -> list[str]:
    scored = []

    for s in sentences:
        if not is_valid_sentence(s):
            continue

        s_low = s.lower()
        score = 0

        for k in keywords:
            if k in s_low:
                score += 2

        # prefer definition-style sentences
        if " is " in s_low or " are " in s_low:
            score += 3

        if score > 0:
            scored.append((score, s))

    scored.sort(key=lambda x: x[0], reverse=True)
    selected = [s for _, s in scored[:limit]]

    if not selected:
        selected = sentences[:2]

    return selected

def normalize_context(context: list[str]) -> list[str]:
    """
    Clean and normalize raw retrieved text into usable sentences.
    """
    cleaned = []

    for chunk in context:
        if not isinstance(chunk, str):
            continue

        # Remove excessive newlines
        text = chunk.replace("\n", " ").replace("\r", " ")
        text = clean_text(text)

        # Skip very short junk
        if len(text) < 40:
            continue

        cleaned.append(text)

    return cleaned

