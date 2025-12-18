from app.services.embedding_service import EmbeddingService
from app.services.vector_store import VectorStore
from app.utils.file_loader import load_text_files
import os

def main():
    print("Starting data ingestion...")

    base_path = os.path.join("knowledge_base", "grade10", "science")
    texts = load_text_files(base_path)

    if not texts:
        print("No documents found.")
        return

    embedder = EmbeddingService()
    store = VectorStore(
        collection_name="grade10_science",
        persist_path="chroma_db"
    )

    embeddings = embedder.embed(texts)

    store.add(
        documents=texts,
        embeddings=embeddings,
        metadatas=[{"source": "grade10_science"}] * len(texts)
    )

    print(f"Successfully ingested {len(texts)} chunks.")

if __name__ == "__main__":
    main()
