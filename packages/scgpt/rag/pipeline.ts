import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { spawn } from "child_process";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_ENV = "us-east-1";
const INDEX_NAME = "scgpt";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pinecone.index(INDEX_NAME);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function embedQueryPython(query: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["./embedding/embed_query.py"]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}: ${error}`);
        return;
      }

      try {
        const parsed = JSON.parse(output);
        resolve(parsed.embedding);
      } catch (err) {
        reject("Error parsing Python output: " + err);
      }
    });

    pythonProcess.stdin.write(query + "\n");
    pythonProcess.stdin.end();
  });
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
  console.log("Using context: ", context.join("\n\n"));
  console.log("Generating final response with LLM...");
  const systemPrompt = `You are a chat assistant roleplaying as an AI chat assistant within the game Star Citizen to answer questions from users. This can range from general queries, to finding out where to buy commodities, the best place to buy commodities, and so much more. All currencies are in aUEC format (alpha united earth credits). Use the following context to answer user queries.\n\nContext:\n${context.join(
    "\n\n"
  )}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
  });

  return completion.choices[0].message.content;
}

async function askRAG(query: string) {
  console.log("Embedding query via Python...");
  const queryEmbedding = await embedQueryPython(query);

  console.log("Searching Pinecone...");
  const retrievedContext = await searchPinecone(queryEmbedding, 50);

  if (retrievedContext.length === 0) {
    console.log(
      "No relevant context found. Falling back to general knowledge."
    );
    return await generateResponse(query, []);
  }

  return await generateResponse(query, retrievedContext);
}

async function generateResponseStream(query: string, context: string[]) {
  console.log("Using context: ", context.join("\n\n"));
  console.log("Generating final response with LLM (Streaming)...");

  const systemPrompt = `You are a chat assistant roleplaying as an AI chat assistant within the game Star Citizen to answer questions from users. This can range from general queries, to finding out where to buy commodities, the best place to buy commodities, and so much more. All currencies are in aUEC format (alpha united earth credits). Use the following context to answer user queries.\n\nContext:\n${context.join(
    "\n\n"
  )}`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    stream: true,
  });

  return stream;
}

export async function askRAGStream(query: string) {
  console.log("Embedding query via Python...");
  const queryEmbedding = await embedQueryPython(query);

  console.log("Searching Pinecone...");
  const retrievedContext = await searchPinecone(queryEmbedding, 50);

  if (retrievedContext.length === 0) {
    console.log(
      "No relevant context found. Falling back to general knowledge."
    );
    return await generateResponseStream(query, []);
  }

  return await generateResponseStream(query, retrievedContext);
}
