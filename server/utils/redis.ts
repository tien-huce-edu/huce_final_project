import { Redis } from "ioredis"
require("dotenv").config()

const redisClient = () => {
    if (process.env.REDIS_PORT && process.env.REDIS_HOST && process.env.REDIS_PASSWORD) {
        console.log("Redis connect success")
        return {
            port: +process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD
        }
    } else {
        throw new Error("Redis connect fail")
    }
}

export const redis = new Redis(redisClient())
