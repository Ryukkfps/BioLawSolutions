// For legacy compatibility, we'll keep a minimal Prisma setup
// But the main application now uses mysql2 directly via /lib/db.ts

import { PrismaClient } from "@prisma/client";

// Simple fallback Prisma client (may not work with Prisma 7 constraints)
// Main app should use mysql2 from /lib/db.ts instead
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: ["error"],
  });
} catch (error) {
  console.warn("Prisma client initialization failed, using mysql2 instead");
  // Create a mock prisma object to prevent crashes
  prisma = {} as PrismaClient;
}

export { prisma };

// Export the mysql2 pool as the primary database connection
export { default as db } from "./db";
