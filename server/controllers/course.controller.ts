import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service"
import CourseModel from "../models/course.model"

// Upload course controller
export const uploadCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const thumbnail = data.thumbnail
            if (thumbnail) {
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "course"
                })
                data.thumbnail = {
                    url: myCloud.secure_url,
                    public_id: myCloud.public_id
                }
            }
            createCourse(data, res, next)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// Update course controller
export const editCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const thumbnail = data.thumbnail
            if (thumbnail) {
                await cloudinary.v2.uploader.destroy(data.thumbnail.public_id)
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "course"
                })
                data.thumbnail = {
                    url: myCloud.secure_url,
                    public_id: myCloud.public_id
                }
            }
            const courseId = req.params.id
            const course = await CourseModel.findByIdAndUpdate(
                courseId,
                { $set: data },
                { new: true }
            )
            res.status(200).json({
                success: true,
                course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
