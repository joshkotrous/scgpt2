import sys
import json
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-mpnet-base-v2")

def embed_query(query):
    embedding = model.encode([query], normalize_embeddings=True).tolist()
    return embedding[0]  # Return as list

if __name__ == "__main__":
    query = sys.stdin.read().strip()  # Read query from TypeScript
    embedding = embed_query(query)
    print(json.dumps({"embedding": embedding}))  # Output as JSON
