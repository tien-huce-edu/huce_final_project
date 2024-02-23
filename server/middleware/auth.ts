import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "./catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import jwt, { JwtPayload } from "jsonwebtoken"
import { redis } from "../utils/redis"

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const access_token = req.cookies.access_token as string
        console.log("cookie", req.cookies)
        if (!access_token) {
            return next(new ErrorHandler("Cookie hết hạn!", 401))
        }
        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload
        if (!decoded) {
            return next(new ErrorHandler("Lỗi máy chủ vui lòng thử lại!", 500))
        }
        const user = await redis.get(decoded.id)
        if (!user) {
            return next(new ErrorHandler("Phiên đăng nhập không tồn tại!", 401))
        }
        req.user = JSON.parse(user)
        next()
    }
)

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(
                new ErrorHandler(`Vai trò ${req.user?.role} không được phép truy cập!`, 403)
            )
        }
        next()
    }
}
