import { OpenAI } from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your environment
});

/**
 * Embeds a query string using OpenAI's embedding model
 *
 * @param query The text to embed
 * @returns A vector representation (embedding) of the query
 */
export async function embedQuery(query: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    // Safe logging: only log error type and name, not the full message which might contain sensitive data
    const errorType = error instanceof Error ? error.constructor.name : typeof error;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error(`Error generating embedding: Type=${errorType}, Name=${errorName}`);
    
    // Throw a sanitized error with just enough information for debugging
    throw new Error(`Failed to generate embedding: ${errorName} error occurred`);
  }
}