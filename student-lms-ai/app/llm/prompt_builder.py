import re
from typing import Optional

# ---------- ENGLISH GREETING PATTERNS ----------
GREETINGS = [
    r"\bhi\b",
    r"\bhello\b",
    r"\bhey\b",
    r"\bhii\b",
    r"\bhy\b",
    r"\bhow are you\b",
    r"\bhey there\b"
]

# ---------- SINHALA GREETING PHRASES (simple match) ----------
SINHALA_GREETINGS = [
    "කොහොමද",
    "ඔයාට කොහොමද",
    "කොහොමද ඔයාට",
    "හෙලෝ",
    "හයි",
    "සුභ උදෑසනක්",
    "සුභ දවසක්",
    "සුභ සන්ධ්‍යාවක්",
]

# Sinhala Unicode block: U+0D80..U+0DFF
SINHALA_UNICODE_RANGE = re.compile(r"[\u0D80-\u0DFF]")


def detect_language(message: Optional[str]) -> str:
    """
    Detect language from message content:
    - Sinhala: contains Sinhala unicode letters
    - Singlish: common Sinhala words typed using English letters
    - English: fallback
    """
    if not message:
        return "English"

    msg = message.strip()
    if not msg:
        return "English"

    if SINHALA_UNICODE_RANGE.search(msg):
        return "Sinhala"

    lower = msg.lower()
    singlish_markers = [
        "kohomada", "oyata", "mage", "eka", "hari", "nam", "ne",
        "mokakda", "monawada", "thiyenne", "kawda", "mata", "oyage",
        "dan", "lassanai", "honda", "nathi", "puluwan", "karanna"
    ]
    if any(w in lower for w in singlish_markers):
        return "Singlish"

    return "English"


def is_greeting(text: Optional[str]) -> bool:
    """
    Safely checks whether user input is a greeting (English / Sinhala / simple cases).
    """
    if not text:
        return False

    raw = text.strip()
    if not raw:
        return False

    lower = raw.lower()

    # Sinhala greeting detection (contains Sinhala letters)
    if SINHALA_UNICODE_RANGE.search(raw):
        for g in SINHALA_GREETINGS:
            if g in raw:
                return True
        # also treat very short Sinhala messages as greeting-like
        if len(raw) <= 12:
            return True

    # English greeting detection (regex)
    return any(re.search(pattern, lower) for pattern in GREETINGS)


def _language_instruction(language: str) -> str:
    """
    Returns language enforcement instructions.
    """
    if language == "Sinhala":
        return (
            "Respond ONLY in Sinhala using proper Sinhala letters.\n"
            "Use clear, natural Sinhala suitable for school students.\n"
            "Avoid repeating the same sentence.\n"
            "Use short paragraphs.\n"
        )

    if language == "Singlish":
        return (
            "Respond in Sri Lankan Singlish.\n"
            "Use English letters only (do NOT use Sinhala letters).\n"
            "Keep the tone polite and natural.\n"
        )

    return "Respond in clear, formal academic English.\n"


def _academic_structure_block(language: str) -> str:
    """
    For Sinhala, rigid English-style headings reduce quality on many local models.
    So Sinhala gets a softer structure guideline.
    """
    if language == "Sinhala":
        return (
            "ANSWER GUIDELINES:\n"
            "- Start with a short Sinhala title.\n"
            "- Explain clearly using short paragraphs.\n"
            "- Include a formula only if it is necessary.\n"
            "- End with a brief summary.\n"
        )

    # English / Singlish can follow strict headings.
    return (
        "STRICT ANSWER STRUCTURE (MUST FOLLOW EXACTLY):\n"
        "1. TITLE\n"
        "2. DEFINITION\n"
        "3. EXPLANATION (clear paragraphs)\n"
        "4. FORMULA (only if applicable, separate section)\n"
        "5. EXPLANATION OF SYMBOLS (if formulas exist)\n"
        "6. KEY POINTS (bullet points only if needed)\n"
        "7. SUMMARY (exam revision style)\n"
    )


def build_system_prompt(
    user_message: Optional[str],
    grade: Optional[str] = None,
    subject: Optional[str] = None,
    language: Optional[str] = "English"
) -> str:
    """
    Builds the system prompt with:
    - Greeting mode (short, friendly)
    - Academic mode (exam-oriented)
    - Language enforcement (English / Sinhala / Singlish)
    - Auto-detect language if language is missing/empty/"Auto"
    """

    # ---------- NORMALIZE LANGUAGE ----------
    lang = (language or "").strip()
    if not lang or lang.lower() == "auto":
        lang = detect_language(user_message)
    else:
        # normalize known values
        low = lang.lower()
        if low in ["sinhala", "si", "සිංහල"]:
            lang = "Sinhala"
        elif low in ["singlish"]:
            lang = "Singlish"
        else:
            lang = "English"

    language_instruction = _language_instruction(lang)

    # ---------- GREETING MODE ----------
    if is_greeting(user_message):
        if lang == "Sinhala":
            greet_text = "හෙලෝ! ඔබගේ පාඩම් සම්බන්ධයෙන් මට කෙසේ උදව් කළ හැකිද?"
        elif lang == "Singlish":
            greet_text = "Hello! Oyage studies walata mata kohomada help karanna puluwan?"
        else:
            greet_text = "Hello! How can I help you with your studies today?"

        return (
            "You are NexDS AI Intelligence, an academic assistant created by Nadeesha D Shalom.\n\n"
            + language_instruction +
            "\nThe user greeted you.\n\n"
            "Respond politely and naturally.\n"
            "Do NOT provide academic explanations.\n"
            "Keep the response short (1 to 2 sentences).\n\n"
            f"Respond like:\n{greet_text}"
        )

    # ---------- ACADEMIC MODE ----------
    scope = (
        f"Grade {grade} {subject} syllabus"
        if grade and subject
        else "general school-level syllabus"
    )

    structure_block = _academic_structure_block(lang)

    return (
        "You are NexDS AI Intelligence, created by Nadeesha D Shalom.\n"
        + language_instruction +
        f"\nYou are a qualified school teacher answering questions based on the {scope}.\n\n"
        + structure_block +
        "\nSTYLE RULES:\n"
        "- Be concise and accurate.\n"
        "- Do not add unnecessary content.\n"
        "- If the question is unclear, ask one short clarifying question.\n"
        "- No emojis.\n"
    )
