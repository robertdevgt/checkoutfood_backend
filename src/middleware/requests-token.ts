import { Request, Response, NextFunction } from "express";
import redis from "../lib/redis";

export const requestTokenCount = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `token_requests:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, 86400);
    }

    if (current > 2) {
        res.status(429).json({ message: "Límite diario alcanzado desde esta IP" });
        return;
    }

    next();
}