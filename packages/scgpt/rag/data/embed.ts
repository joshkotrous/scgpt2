import fs from "fs";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import cliProgress from "cli-progress";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration
const CHUNKS_FILE = "./output/uex-data-chunks-2025-03-03.json";
const BATCH_SIZE = 100; // For OpenAI API calls
const PINECONE_BATCH_SIZE = 100; // For Pinecone uploads

// Pinecone configuration
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const INDEX_NAME = "scgpt-oai-small";

// Define types
interface ChunkObject {
  id: string;
  text: string;
  metadata?: any;
  [key: string]: any;
}

interface OpenAIEmbeddingResponse {
  embedding: number[];
  index: number;
  object: string;
}

interface PineconeVector {
  id: string;
  values: number[];
  metadata: Record<string, string | number | boolean>;
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Splits an array into smaller batches
 */
function getBatches<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Converts metadata object to string values for Pinecone
 */
function processMetadata(
  metadata: any
): Record<string, string | number | boolean> {
  if (!metadata) return {};

  return Object.entries(metadata).reduce((result, [key, value]) => {
    // Handle undefined case explicitly
    if (value === undefined || value === null) {
      result[key] = ""; // Convert null/undefined to empty string
    } else if (typeof value === "object") {
      result[key] = JSON.stringify(value);
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      // Accept only valid Pinecone metadata types
      result[key] = value;
    } else {
      // Convert any other types to string
      result[key] = String(value);
    }
    return result;
  }, {} as Record<string, string | number | boolean>);
}

/**
 * Validates a chunk object against the expected schema
 * @returns Object containing validation result and sanitized chunk if valid
 */
function validateChunk(chunk: any): { valid: boolean; sanitized?: ChunkObject } {
  // Ensure it's an object
  if (typeof chunk !== 'object' || chunk === null) {
    return { valid: false };
  }
  
  // Check required fields
  if (typeof chunk.text !== 'string') {
    return { valid: false };
  }
  
  // Sanitized version of the chunk
  const sanitized: ChunkObject = {
    id: typeof chunk.id === 'string' ? chunk.id : `chunk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text: chunk.text
  };
  
  // Validate and sanitize metadata if present
  if (chunk.metadata !== undefined) {
    if (typeof chunk.metadata !== 'object' || chunk.metadata === null) {
      // Invalid metadata, don't include it
      return { valid: true, sanitized };
    }
    
    // Include metadata but it will be sanitized by processMetadata later
    sanitized.metadata = chunk.metadata;
  }
  
  return { valid: true, sanitized };
}

/**
 * Embeds text chunks and uploads directly to Pinecone
 */
async function embedAndUploadToPinecone(): Promise<void> {
  console.log("Starting embedding and uploading process...");

  // Validate environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    return;
  }

  if (!PINECONE_API_KEY) {
    console.error("Error: PINECONE_API_KEY environment variable is not set.");
    return;
  }

  // Check if input file exists
  if (!fs.existsSync(CHUNKS_FILE)) {
    console.error(`Error: File ${CHUNKS_FILE} not found.`);
    return;
  }

  // Initialize Pinecone
  console.log("Connecting to Pinecone...");
  const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  const index = pinecone.index(INDEX_NAME);

  try {
    // Read chunks from file
    console.log(`Reading chunks from ${CHUNKS_FILE}...`);
    const fileContent = fs.readFileSync(CHUNKS_FILE, "utf-8");
    let rawChunks: any[];

    try {
      rawChunks = JSON.parse(fileContent);
    } catch (e) {
      throw new Error(`Failed to parse JSON file: ${e}`);
    }

    if (!Array.isArray(rawChunks)) {
      throw new Error("File content is not a list of chunks.");
    }

    // Validate and sanitize each chunk
    const validatedChunks: ChunkObject[] = [];
    let invalidCount = 0;
    
    for (const chunk of rawChunks) {
      const validation = validateChunk(chunk);
      if (validation.valid && validation.sanitized) {
        validatedChunks.push(validation.sanitized);
      } else {
        invalidCount++;
      }
    }

    console.log(`Found ${validatedChunks.length} valid chunks for processing (${invalidCount} invalid chunks skipped)`);

    // If we don't have any valid chunks, stop processing
    if (validatedChunks.length === 0) {
      throw new Error("No valid chunks found in the input file.");
    }

    // Extract text from chunk objects
    const textChunks: string[] = validatedChunks.map((chunk) => chunk.text);

    // Split into batches for the OpenAI API
    const openAIBatches = getBatches(textChunks, BATCH_SIZE);
    console.log(
      `Split into ${openAIBatches.length} OpenAI batches of max size ${BATCH_SIZE}`
    );

    // Create a progress bar for embedding
    const embeddingProgressBar = new cliProgress.SingleBar({
      format:
        "Embedding |{bar}| {percentage}% | {value}/{total} Batches | ETA: {eta}s",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    });

    // Start the progress bar
    embeddingProgressBar.start(openAIBatches.length, 0);

    // Store vectors as we go, so we don't need to keep them all in memory
    let processedVectors = 0;
    let uploadedVectors = 0;

    // Create a progress bar for uploading
    const uploadProgressBar = new cliProgress.SingleBar({
      format:
        "Uploading |{bar}| {percentage}% | {value}/{total} Vectors | ETA: {eta}s",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    });

    // We'll start the upload progress bar once we know how many vectors we have
    let totalVectors = validatedChunks.length;
    uploadProgressBar.start(totalVectors, 0);

    // Process each embedding batch and upload to Pinecone
    for (let i = 0; i < openAIBatches.length; i++) {
      const batch = openAIBatches[i];

      try {
        // Get embeddings for this batch
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: batch,
          encoding_format: "float",
        });

        // Convert to Pinecone vectors
        const vectors: PineconeVector[] = [];

        for (let j = 0; j < response.data.length; j++) {
          const chunkIndex = i * BATCH_SIZE + j;

          if (chunkIndex < validatedChunks.length) {
            const chunk = validatedChunks[chunkIndex];

            vectors.push({
              id: chunk.id || `chunk-${chunkIndex}`,
              values: response.data[j].embedding,
              metadata: {
                text: chunk.text,
                ...processMetadata(chunk.metadata),
              },
            });

            processedVectors++;
          }
        }

        // Upload vectors to Pinecone in batches
        const pineconeVectorBatches = getBatches(vectors, PINECONE_BATCH_SIZE);

        for (const vectorBatch of pineconeVectorBatches) {
          try {
            await index.upsert(vectorBatch);
            uploadedVectors += vectorBatch.length;
            uploadProgressBar.update(uploadedVectors);
          } catch (uploadError) {
            console.error(
              "\nError uploading vector batch to Pinecone:",
              uploadError
            );
          }
        }
      } catch (error) {
        console.error(`\nError processing embedding batch ${i + 1}:`, error);
      }

      // Update embedding progress
      embeddingProgressBar.update(i + 1);

      // Add a small delay between embedding batches
      if (i < openAIBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    // Stop the progress bars
    embeddingProgressBar.stop();
    uploadProgressBar.stop();

    console.log(`\nProcess complete!`);
    console.log(`Processed ${processedVectors} vectors`);
    console.log(
      `Uploaded ${uploadedVectors} vectors to Pinecone index "${INDEX_NAME}"`
    );

    if (processedVectors > 0) {
      console.log(`Embedding dimensions: ${validatedChunks[0].text.length}`);
    }
  } catch (error) {
    console.error(`Error in process:`, error);
  }
}

// Run the script
if (require.main === module) {
  embedAndUploadToPinecone()
    .then(() => console.log("Script execution completed"))
    .catch((err) => console.error("Fatal error:", err));
}

// Export for potential module usage
export { embedAndUploadToPinecone };