import os

def load_text_files(base_path: str) -> list[str]:
    texts = []

    for root, _, files in os.walk(base_path):
        for file in files:
            if not file.endswith(".txt"):
                continue

            path = os.path.join(root, file)

            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

                # split into logical chunks
                chunks = content.split("\n\n")

                for chunk in chunks:
                    clean = chunk.strip()
                    if len(clean) >= 80:
                        texts.append(clean)

    return texts
