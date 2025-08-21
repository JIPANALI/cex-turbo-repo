import { Router } from "express";

export const tickerRouter = Router();
import { RedisManager } from "../RedisManager";


tickerRouter.get("/", async (req, res) => {
    const {market} = req.query;

    res.json({})

});