import { Request, Response, NextFunction } from "express"
import ErrorHandler from "../utils/ErrorHandler"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import { generateLast12MonthData } from "../utils/analystic.generator"
import userModel from "../models/user.model"
import CourseModel from "../models/course.model"
import orderModel from "../models/orderModel"

// get user analystic -- only for admin

export const getUserAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usersAnalytics = await generateLast12MonthData(userModel)
            res.status(200).json({
                success: true,
                usersAnalytics
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

export const getCourseAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const coursesAnalytics = await generateLast12MonthData(CourseModel)
            res.status(200).json({
                success: true,
                coursesAnalytics
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

export const getOrdersAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ordersAnalytics = await generateLast12MonthData(orderModel)
            res.status(200).json({
                success: true,
                ordersAnalytics
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

