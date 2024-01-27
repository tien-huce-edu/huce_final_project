import e from "express"
import { Redis } from "ioredis"
require("dotenv").config()

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis connect success")
        return JSON.parse(process.env.REDIS_URL)
    } else {
        throw new Error("Redis connect fail")
    }
}

export const redis = new Redis(redisClient())
