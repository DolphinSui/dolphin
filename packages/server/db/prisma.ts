import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import type { PoolClient } from "pg"; // Use type-only import

// Ensure a single Prisma instance in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// PostgreSQL Pool for LISTEN/NOTIFY
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

pgPool.connect().then((client: PoolClient) => {
  console.log("📡 Listening for new_user notifications...");
  client.query("LISTEN new_user");

  client.on("notification", (msg) => {
    console.log("🔥 PostgreSQL NOTIFY event received:", msg.payload);
  });
});

export { pgPool };
