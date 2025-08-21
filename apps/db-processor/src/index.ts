import { createClient } from "redis";
import { DBMessageTypes } from "./types";   
import { prismaClient } from "@repo/db/client";


async function main() {
    const redisClient = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    await redisClient.connect();

    while (true) {
        const response=await redisClient.rPop("db_processor" as string);
        if (!response) {
            // No message, wait for a while before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }else{
            const message: DBMessageTypes = JSON.parse(response);
            switch (message.type) {
                case "TRADE_ADDED":
                    await prismaClient.trade.create({
                        data: {
                            id: message.data.id,
                            isBuyerMaker: message.data.isBuyerMaker,
                            price: message.data.price,
                            quantity: message.data.quantity,
                            quoteQuantity: message.data.quoteQuantity,
                            timestamp: new Date(message.data.timestamp),
                            market: message.data.market,
                        },
                    });
                    break;
                case "ORDER_UPDATE":
                    await prismaClient.order.update({
                        where: { id: message.data.orderId },
                        data: {
                            executedQty: message.data.executedQty,
                            market: message.data.market,
                            price: message.data.price,
                            quantity: message.data.quantity,
                            side: message.data.side,
                        },
                    });
                    break;
                default:
                    console.error("Unknown message type:");
            }   
        }
}
}

main();