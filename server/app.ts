require("dotenv").config()
import express, { NextFunction, Request, Response } from "express"
export const app = express()

import cookieParser from "cookie-parser"
import cors from "cors"
import { ErrorMiddleware } from "./middleware/error"
import courseRouter from "./routes/course.route"
import userRouter from "./routes/user.route"
import orderRouter from "./routes/order.route"
import notificationRouter from "./routes/notification.route"
import analysticRouter from "./routes/analystics.route"
import layoutRouter from "./routes/layout.route"
import rateLimit from "express-rate-limit"

// body parser
app.use(express.json({ limit: "50mb" }))

// cookie parser
app.use(cookieParser())

// cors => resourse sharing
app.use(
    cors({
        origin: JSON.parse(process.env.CORS_ORIGIN || ""),
        credentials: true
    })
)

// api req limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
})

// API route
app.use(
    "/api/v1",
    userRouter,
    courseRouter,
    orderRouter,
    notificationRouter,
    analysticRouter,
    layoutRouter
)

// testing route
app.get("/api/v1/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API Working"
    })
})

// Unknow route

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})

app.use(limiter)

app.use(ErrorMiddleware)
