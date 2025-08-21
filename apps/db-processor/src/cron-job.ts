import { prismaClient } from "@repo/db/client";



// Set to true if each MV has a UNIQUE index that covers all rows
// e.g., CREATE UNIQUE INDEX ux_klines_1m ON klines_1m(bucket, currency_code);
const useConcurrently = false;

async function refreshSingle(viewName: string) {
  const sql = `REFRESH MATERIALIZED VIEW${useConcurrently ? " CONCURRENTLY" : ""} ${viewName}`;
  await prismaClient.$executeRawUnsafe(sql);
  console.log(`[${new Date().toISOString()}] Refreshed ${viewName}`);
}

export async function refreshViews() {
  // Run sequentially to avoid overlapping MV locks
  await refreshSingle("klines_1m");
  await refreshSingle("klines_1h");
  await refreshSingle("klines_1w");
  console.log("Materialized views refreshed successfully");
}

async function main() {
  try {
    await refreshViews();
  } catch (err) {
    console.error("Initial refresh failed:", err);
  }

  // Schedule every 10 seconds (same as your pg version)
  const intervalMs = 10_000;
  const timer = setInterval(async () => {
    try {
      await refreshViews();
    } catch (err) {
      console.error("Scheduled refresh failed:", err);
    }
  }, intervalMs);

  // Graceful shutdown
  const shutdown = async () => {
    clearInterval(timer);
    await prismaClient.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async (e) => {
  console.error(e);
  await prismaClient.$disconnect();
  process.exit(1);
});


