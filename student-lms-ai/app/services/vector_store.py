import chromadb
from chromadb.config import Settings


class VectorStore:
    def __init__(self, collection_name: str, persist_path: str):
        self.client = chromadb.PersistentClient(
            path=persist_path
        )

        self.collection = self.client.get_or_create_collection(
            name=collection_name
        )

    def add(self, documents, embeddings, metadatas):
        if not documents or not embeddings:
            return

        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=[str(i) for i in range(len(documents))]
        )

    def query(self, query_embeddings=None, query_texts=None, n_results=5):
        return self.collection.query(
            query_embeddings=query_embeddings,
            query_texts=query_texts,
            n_results=n_results
        )
