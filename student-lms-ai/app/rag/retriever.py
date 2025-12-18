from typing import List
import chromadb

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="grade10_science"
)


def retrieve_context(question: str, top_k: int = 5) -> List[str]:
    results = collection.query(
        query_texts=[question],
        n_results=top_k
    )

    documents = results.get("documents", [])

    context: List[str] = []
    for group in documents:
        for doc in group:
            if isinstance(doc, str):
                context.append(doc)

    return context
