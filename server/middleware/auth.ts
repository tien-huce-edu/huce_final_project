import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "./catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import jwt, { JwtPayload } from "jsonwebtoken"
import { redis } from "../utils/redis"

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const access_token = req.cookies.access_token
        if (!access_token) {
            return next(new ErrorHandler("Bạn chưa đăng nhập", 401))
        }
        const decoded = jwt.verify(
            access_token,
            process.env.ACCESS_TOKEN as string
        ) as JwtPayload
        if (!decoded) {
            return next(new ErrorHandler("Phiên đăng nhập không tồn tại!", 401))
        }
        const user = await redis.get(decoded.id)
        if (!user) {
            return next(new ErrorHandler("Phiên đăng nhập không tồn tại!", 401))
        }
        req.user = JSON.parse(user)
        next()
    }
)
