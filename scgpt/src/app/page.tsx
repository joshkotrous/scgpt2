// app/page.tsx or app/page.js (depending on your setup)
import { headers } from "next/headers";
import { connectToDatabase } from "db";
import ChatClient from "./chatClient";
import { RequestLog } from "db/schema";

export interface IPStats {
  ip: string;
  totalRequests: number;
  recentRequests: number;
}

// Helper function to validate IP address
function isValidIP(ip: string): boolean {
  // Validate IPv4
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255 && part === num.toString();
    });
  }
  
  // Basic IPv6 check (not exhaustive)
  if (ip.includes(':')) {
    return /^[0-9a-f:]+$/i.test(ip);
  }
  
  return false;
}

async function getIpStats(): Promise<IPStats> {
  await connectToDatabase();

  // Get the client's IP address
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  
  let ip = "unknown";
  if (forwardedFor) {
    const clientIP = forwardedFor.split(",")[0].trim();
    if (isValidIP(clientIP)) {
      ip = clientIP;
    }
  }

  // Count total requests from this IP
  const totalRequests = await RequestLog.countDocuments({ ip });

  // Count requests in the last 24 hours
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);
  const recentRequests = await RequestLog.countDocuments({
    ip,
    timestamp: { $gte: last24Hours },
  });

  return {
    ip,
    totalRequests,
    recentRequests,
  };
}

export default async function Home() {
  const ipStats = await getIpStats();
  return (
    <div className="size-full max-w-5xl container mx-auto">
      <ChatClient ipStats={ipStats} />

      <div className="text-xs text-gray-500 mt-2 text-right">
        IP: {ipStats.ip} | Requests: {ipStats.totalRequests} (Last 24h:{" "}
        {ipStats.recentRequests})
      </div>
    </div>
  );
}