// app/api/rag/route.ts
import { askRAGStream } from "@/lib/rag";
import { connectToDatabase } from "db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { RequestLog } from "db/schema";

// Helper function to validate IP addresses
function validateIp(ip: string): string | null {
  if (!ip) return null;
  
  // Get the first IP if comma-separated list (common in x-forwarded-for)
  const firstIp = ip.split(',')[0].trim();
  
  // IPv4 validation
  if (/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(firstIp)) {
    const octets = firstIp.split('.').map(Number);
    // Check if all octets are valid (0-255)
    if (octets.every(octet => octet >= 0 && octet <= 255)) {
      return firstIp;
    }
    return null;
  }
  
  // IPv6 basic validation
  // Allow only valid characters and check for colon presence
  if (/^[0-9a-f:]+$/i.test(firstIp) && firstIp.includes(':')) {
    // Check that we don't have more than 7 colons (8 segments max)
    const colonCount = (firstIp.match(/:/g) || []).length;
    if (colonCount <= 7) {
      // Check that segments don't have more than 4 hex digits
      const segments = firstIp.split(':');
      if (segments.every(segment => segment.length <= 4)) {
        return firstIp;
      }
    }
  }
  
  return null;
}

// Helper function to get the real IP address
async function getIpAddress(req: Request): Promise<string> {
  const headersList = await headers();

  // Try different headers that might contain the IP
  // Order matters - most reliable sources first
  const ipSources = [
    headersList.get("x-real-ip"),
    headersList.get("x-forwarded-for"),
    headersList.get("cf-connecting-ip"), // Cloudflare
    headersList.get("true-client-ip"), // Akamai and Cloudflare
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("true-client-ip"),
  ];

  // Use the first non-null value that validates as an IP address
  for (const ip of ipSources) {
    const validIp = validateIp(ip);
    if (validIp) {
      return validIp;
    }
  }

  // Fallback to unknown
  return "unknown";
}

// Helper function to validate and sanitize query input
function validateAndSanitizeQuery(query: unknown): string | null {
  // Check if query exists and is a string
  if (typeof query !== 'string') {
    return null;
  }

  // Check query length (limiting to 1000 characters as a reasonable limit)
  const MAX_QUERY_LENGTH = 1000;
  if (query.length === 0 || query.length > MAX_QUERY_LENGTH) {
    return null;
  }

  // Basic sanitization
  // Remove control characters and other potentially harmful patterns
  const sanitizedQuery = query
    .replace(/[^\x20-\x7E\s]/g, '') // Remove non-printable ASCII characters
    .trim();
  
  // If sanitization removed everything, return null
  if (sanitizedQuery.length === 0) {
    return null;
  }

  return sanitizedQuery;
}

export async function POST(req: Request) {
  // Connect to database
  await connectToDatabase();

  // Extract data from request
  let reqData;
  try {
    reqData = await req.json();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid JSON payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate and sanitize the query parameter
  const sanitizedQuery = validateAndSanitizeQuery(reqData.query);
  if (!sanitizedQuery) {
    return new NextResponse(
      JSON.stringify({
        error: "Invalid query. Query must be a non-empty string with a reasonable length and valid characters."
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get IP address
  const ip = await getIpAddress(req);

  // Get user agent from both possible sources
  const headersList = await headers();
  const userAgent =
    headersList.get("user-agent") || req.headers.get("user-agent") || "unknown";

  // Log the request and headers for debugging
  console.log("IP Address:", ip);
  console.log("User Agent:", userAgent);

  // Remove header logging to prevent exposure of sensitive information
  // and potential log injection vulnerabilities
  
  try {
    // Log the request asynchronously
    RequestLog.create({
      ip,
      query: sanitizedQuery, // Use sanitized query here
      userAgent,
      timestamp: new Date(),
    }).catch((err) => {
      console.error("Error logging request:", err);
    });
  } catch (error) {
    console.error("Error initializing request log:", error);
  }

  try {
    // Process the query with the RAG system using the sanitized query
    const stream = await askRAGStream(sanitizedQuery);

    // Return streaming response
    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(new TextEncoder().encode(content));
          }
          controller.close();
        },
      }),
      {
        headers: { "Content-Type": "text/plain" },
      }
    );
  } catch (error) {
    console.error("Error processing RAG query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}