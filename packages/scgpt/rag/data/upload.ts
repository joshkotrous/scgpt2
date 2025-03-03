import { Pinecone } from "@pinecone-database/pinecone";
import * as fs from "fs";
import * as dotenv from "dotenv";
import cliProgress from "cli-progress";

// Load environment variables
dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_ENV = "us-east-1";
const INDEX_NAME = "scgpt";

// Set file path (Ensure your JSON file exists)
const EMBEDDINGS_FILE = `./output/embedded-chunks-2025-03-02.json`;
async function uploadEmbeddings() {
  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
    const index = pinecone.index(INDEX_NAME);

    // Read embeddings from file
    const rawData = fs.readFileSync(EMBEDDINGS_FILE, "utf-8");
    const embeddedData: { chunk: any; embedding: number[] }[] =
      JSON.parse(rawData);

    // Prepare data for Pinecone
    const vectors = embeddedData.map((item, i) => {
      const { id, text, metadata } = item.chunk; // Extract fields
      return {
        id: id || `chunk-${i}`, // Ensure a valid ID
        values: item.embedding, // Embedding vector
        metadata: {
          text, // ✅ Store only the text
          ...Object.fromEntries(
            Object.entries(metadata).map(([key, value]) => [key, String(value)]) // Convert metadata values to strings
          ),
        },
      };
    });

    // Setup Progress Bar
    const batchSize = 100;
    const totalBatches = Math.ceil(vectors.length / batchSize);
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    console.log(
      `Uploading ${vectors.length} vectors in ${totalBatches} batches...`
    );
    progressBar.start(totalBatches, 0); // Start progress bar

    // Upload in batches to Pinecone
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      progressBar.increment(); // Update progress
    }

    progressBar.stop(); // Stop progress bar
    console.log("All embeddings uploaded successfully!");
  } catch (error) {
    console.error("Error uploading embeddings:", error);
  }
}

uploadEmbeddings();
