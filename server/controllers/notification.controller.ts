import NotificationModel from "../models/notificationModel"
import { NextFunction, Request, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import cron from "node-cron"

// Create notification only for admin
export const getNotifications = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notifications = await NotificationModel.find().sort({
                createdAt: -1
            })
            res.status(200).json({
                success: true,
                notifications
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500))
        }
    }
)

// update notification
export const updateNotification = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notification = await NotificationModel.findById(req.params.id)
            if (!notification) {
                return next(new ErrorHandler("Không tìm thấy thông báo", 404))
            }
            notification.status = "read"
            await notification.save()
            const notifications = await NotificationModel.find().sort({ createdAt: -1 })
            res.status(200).json({
                success: true,
                notifications
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500))
        }
    }
)

// delete notification -- only for admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } })
    console.log("delete notification 30 days ago")
})
