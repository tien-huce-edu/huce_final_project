"use strict";
// import { Redis } from "ioredis"
// require("dotenv").config()
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
// const redisClient =  () => {
//     console.log("Redis connectting...")
//     if (process.env.REDIS_PORT && process.env.REDIS_HOST && process.env.REDIS_PASSWORD) {
//         console.log("Redis connected")
//         return {
//             port: +process.env.REDIS_PORT,
//             host: process.env.REDIS_HOST,
//             password: process.env.REDIS_PASSWORD
//         }
//     } else {
//         throw new Error("Redis connect fail")
//     }
// }
// export const redis = new Redis(redisClient())
const ioredis_1 = require("ioredis");
require("dotenv").config();
const redisCLient = () => {
    if (process.env.REDIS_URL) {
        console.log(`Redis Connected`);
        return process.env.REDIS_URL;
    }
    throw new Error("Redis connection failed");
};
exports.redis = new ioredis_1.Redis(redisCLient());
