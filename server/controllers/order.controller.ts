import { NextFunction, Request, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import orderModel, { IOrder } from "../models/orderModel"
import userModel from "../models/user.model"
import path from "path"
import ejs from "ejs"
import sendMail from "../utils/sendMail"
import NotificationModel from "../models/notificationModel"
import { newOrder } from "../services/order.service"
import CourseModel from "../models/course.model"

// create order
export const createOrder = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId, payment_info } = req.body as IOrder

            const user = await userModel.findById(req.user?._id)

            if (!user) {
                return next(new ErrorHandler("Không tìm thấy người dùng", 404))
            }
            const courseExistInUser = user.courses.some(
                (course: any) => course.toString() === courseId
            )
            if (courseExistInUser) {
                return next(new ErrorHandler("Bạn đã mua khóa học này rồi", 400))
            }

            const course = await CourseModel.findById(courseId)
            if (!course) {
                return next(new ErrorHandler("Không tìm thấy khóa học", 404))
            }

            const data: any = {
                courseId: course._id,
                userId: user._id
            }

            newOrder(data, res, next)

            const mailData = {
                order: {
                    _id: course._id.slice(0, 6),
                    name: course.name,
                    price: course.price,
                    date: new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                }
            }
            const html = await ejs.renderFile(
                path.join(__dirname, "..mails/order-confimation.ejs"),
                { order: mailData }
            )

            try {
                if (user) {
                    await sendMail({
                        email: user.email,
                        subject: "Xác nhận đơn hàng",
                        template: "order-confimation.ejs",
                        data: mailData
                    })
                }
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500))
            }
            user?.courses.push(course?._id)
            await user?.save()

            const notification = await NotificationModel.create({
                user: user?._id,
                title: "Đơn hàng mới",
                content: `Bạn đã mua khóa học ${course.name}`
            })
            res.status(201).json({
                success: true,
                message: "Đã tạo đơn hàng thành công",
                order: course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
