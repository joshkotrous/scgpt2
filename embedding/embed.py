import json
import os
from sentence_transformers import SentenceTransformer

CHUNKS_FILE = "./output/uex-data-chunks-2025-03-03.json" 
EMBEDDINGS_FILE = "./output/embedded-chunks-2025-03-02.json"
print("Loading embedding model...")
model = SentenceTransformer("all-mpnet-base-v2")
print("Model loaded successfully.")

def embed_chunks():
    if not os.path.exists(CHUNKS_FILE):
        print(f"Error: File {CHUNKS_FILE} not found.")
        return
    
    try:
        # Read chunks from file
        with open(CHUNKS_FILE, "r", encoding="utf-8") as file:
            chunks = json.load(file)

        if not isinstance(chunks, list):
            raise ValueError("File content is not a list of text chunks.")

        print(f"Processing {len(chunks)} chunks...")

        # Generate embeddings
        embeddings = model.encode(chunks, normalize_embeddings=True).tolist()

        # Store embeddings
        embedded_data = [{"chunk": chunk, "embedding": emb} for chunk, emb in zip(chunks, embeddings)]

        with open(EMBEDDINGS_FILE, "w", encoding="utf-8") as file:
            json.dump(embedded_data, file, indent=2)

        print(f"Embeddings saved to {EMBEDDINGS_FILE}")

    except Exception as e:
        print(f"Error processing embeddings: {e}")

if __name__ == "__main__":
    embed_chunks()