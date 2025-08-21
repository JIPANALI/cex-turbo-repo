
import { Router } from "express";
import { prismaClient } from "@repo/db/client";


export const klineRouter = Router();

type Interval = "1m" | "1h" | "1w";

// If your client needs numbers instead of Decimal.js instances, enable this:
function asNum(v: any) {
  if (v == null) return v;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  // prismaClientClient Decimal
  if (typeof (v as any).toNumber === "function") return (v as any).toNumber();
  if (typeof (v as any).toString === "function") return Number((v as any).toString());
  return v;
}

klineRouter.get("/", async (req, res) => {
  const { market, interval, startTime, endTime } = req.query;

  let model: "klines_1m" | "klines_1h" | "klines_1w" | null = null;

  switch (interval) {
    case "1m":
      model = "klines_1m";
      break;
    case "1h":
      model = "klines_1h"; // if you truly want 1h to read from 1m, change this back to "klines_1m"
      break;
    case "1w":
      model = "klines_1w";
      break;
    default:
      return res.status(400).send("Invalid interval");
  }

  const s = Number(startTime);
  const e = Number(endTime);
  if (!Number.isFinite(s) || !Number.isFinite(e)) {
    return res.status(400).send("Invalid startTime or endTime");
  }

  // Convert from UNIX seconds to Date
  const start = new Date(s * 1000);
  const end = new Date(e * 1000);

  try {
    const where: any = {
      bucket: { gte: start, lte: end },
    };

    if (typeof market === "string" && market.length > 0) {
      where.market = market;
    }

    let rows: any[] = [];
    if (model === "klines_1m") {
      rows = await prismaClient.kline1m.findMany({
        where,
        orderBy: { bucket: "asc" },
      });
    } else if (model === "klines_1h") {
      rows = await prismaClient.kline1h.findMany({
        where,
        orderBy: { bucket: "asc" },
      });
    } else if (model === "klines_1w") {
      rows = await prismaClient.kline1w.findMany({
        where,
        orderBy: { bucket: "asc" },
      });
    }

    // Exact response mapping as in your original program
    const payload = rows.map((x) => ({
      close: asNum(x.close),
      end: x.bucket,
      high: asNum(x.high),
      low: asNum(x.low),
      open: asNum(x.open),
      quoteVolume: asNum(x.quoteVolume),
      start: x.start,
      trades: x.trades,
      volume: asNum(x.volume),
    }));

    res.json(payload);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err?.message ?? "Internal Server Error");
  }
});
