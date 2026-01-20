import re

SINHALA_UNICODE_RANGE = re.compile(r"[\u0D80-\u0DFF]")

SINGLISH_MARKERS = [
    "kohomada", "oyata", "mage", "eka", "hari", "nam", "ne",
    "mokakda", "monawada", "thiyenne", "oyage", "mata", "oyata"
]


def detect_language(message: str) -> str:
    if not message:
        return "English"

    # Sinhala Unicode detection
    if SINHALA_UNICODE_RANGE.search(message):
        return "Sinhala"

    lower = message.lower()

    # Singlish detection
    if any(word in lower for word in SINGLISH_MARKERS):
        return "Singlish"

    return "English"
