import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { embedQuery } from "./embed";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const INDEX_NAME = "scgpt-oai-small";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pinecone.index(INDEX_NAME);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Security constants
const MAX_QUERY_LENGTH = 1000; // Maximum allowed query length
const MAX_CONTEXT_ITEM_LENGTH = 10000; // Maximum length for each context item
const MAX_TOTAL_CONTEXT_LENGTH = 100000; // Maximum aggregated context length

// Function to validate and sanitize user input
function validateAndSanitizeInput(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Truncate to max length
  let sanitized = input.slice(0, maxLength);
  
  // Basic sanitization to prevent prompt injection
  sanitized = sanitized
    .replace(/\{\{.*?\}\}/g, '') // Remove handlebars-style templates
    .replace(/\$\{.*?\}/g, '')   // Remove template literals
    .replace(/\/\/.*$/gm, '')    // Remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^system:/gmi, '[filtered]') // Block attempts to change system role
    .replace(/^user:/gmi, '[filtered]')   // Block attempts to mimic user role
    .replace(/^assistant:/gmi, '[filtered]') // Block attempts to mimic assistant role
    .trim();
  
  return sanitized;
}

// Function to validate and sanitize context array
function validateAndSanitizeContext(context: string[]): string[] {
  if (!Array.isArray(context)) {
    return [];
  }
  
  const sanitizedContext: string[] = [];
  let totalLength = 0;
  
  for (const item of context) {
    if (typeof item === 'string') {
      const sanitizedItem = validateAndSanitizeInput(item, MAX_CONTEXT_ITEM_LENGTH);
      
      // Check if adding this item would exceed total context length
      if (totalLength + sanitizedItem.length <= MAX_TOTAL_CONTEXT_LENGTH) {
        sanitizedContext.push(sanitizedItem);
        totalLength += sanitizedItem.length;
      } else {
        console.log("Truncating context to stay within size limits");
        break;
      }
    }
  }
  
  return sanitizedContext;
}

async function searchPinecone(queryEmbedding: number[], topK = 5) {
  console.log(`Searching Pinecone for similar embeddings (top ${topK})...`);
  const results = await index.query({
    vector: queryEmbedding,
    topK: topK,
    includeMetadata: true,
  });

  return results.matches
    .map((match) => match.metadata?.text)
    .filter(Boolean) as string[];
}

async function generateResponse(query: string, context: string[]) {
  // Sanitize inputs
  const sanitizedQuery = validateAndSanitizeInput(query, MAX_QUERY_LENGTH);
  const sanitizedContext = validateAndSanitizeContext(context);
  
  console.log("Using context: ", sanitizedContext.join("\n\n"));
  console.log("Generating final response with LLM...");
  
  const systemPrompt = `You are a chat assistant roleplaying as an AI chat assistant within the game Star Citizen to answer questions from users. This can range from general queries, to finding out where to buy commodities, the best place to buy commodities, and so much more. All currencies are in aUEC format (alpha united earth credits). Use the following context to answer user queries.\n\nContext:\n${sanitizedContext.join(
    "\n\n"
  )}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: sanitizedQuery },
    ],
  });

  return completion.choices[0].message.content;
}

async function askRAG(query: string) {
  console.log("Embedding query...");
  const sanitizedQuery = validateAndSanitizeInput(query, MAX_QUERY_LENGTH);
  const queryEmbedding = await embedQuery(sanitizedQuery);

  console.log("Searching Pinecone...");
  const retrievedContext = await searchPinecone(queryEmbedding, 50);

  if (retrievedContext.length === 0) {
    console.log(
      "No relevant context found. Falling back to general knowledge."
    );
    return await generateResponse(sanitizedQuery, []);
  }

  return await generateResponse(sanitizedQuery, retrievedContext);
}

async function generateResponseStream(query: string, context: string[]) {
  // Sanitize inputs
  const sanitizedQuery = validateAndSanitizeInput(query, MAX_QUERY_LENGTH);
  const sanitizedContext = validateAndSanitizeContext(context);
  
  console.log("Generating final response with LLM (Streaming)...");

  const systemPrompt = `You are a chat assistant roleplaying as an AI chat assistant within the game Star Citizen to answer questions from users. This can range from general queries, to finding out where to buy commodities, the best place to buy commodities, and so much more. All currencies are in aUEC format (alpha united earth credits). Use the following context to answer user queries.\n\nContext:\n${sanitizedContext.join(
    "\n\n"
  )}
  
  Output your response in markdown for proper formatting in the chat ui including proper headings. 
  `;

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: sanitizedQuery },
    ],
    stream: true,
  });
  return stream;
}

export async function askRAGStream(query: string) {
  console.log("Embedding query...");
  const sanitizedQuery = validateAndSanitizeInput(query, MAX_QUERY_LENGTH);
  const queryEmbedding = await embedQuery(sanitizedQuery);

  console.log("Searching Pinecone...");
  const retrievedContext = await searchPinecone(queryEmbedding, 50);

  if (retrievedContext.length === 0) {
    console.log(
      "No relevant context found. Falling back to general knowledge."
    );
    return await generateResponseStream(sanitizedQuery, []);
  }

  return await generateResponseStream(sanitizedQuery, retrievedContext);
}