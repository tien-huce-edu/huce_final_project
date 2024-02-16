import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service"
import CourseModel from "../models/course.model"
import { redis } from "../utils/redis"

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

// get single course without purchasing controller
export const getSingleCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id
            const isCacheExist = await redis.get(courseId)

            if (isCacheExist) {
                return res.status(200).json({
                    success: true,
                    course: JSON.parse(isCacheExist)
                })
            } else {
                const course = await CourseModel.findById(req.params.id).select(
                    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                )
                await redis.set(courseId, JSON.stringify(course))
                if (!course) {
                    return next(new ErrorHandler("Không tìm thấy khóa học!", 404))
                }
                res.status(200).json({
                    success: true,
                    course
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// get all courses without purchasing controller
export const getAllCourses = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isCacheExist = await redis.get("allCourses")

            if (isCacheExist) {
                const courses = JSON.parse(isCacheExist)
                return res.status(200).json({
                    success: true,
                    courses
                })
            } else {
                const courses = await CourseModel.find().select(
                    "-courseData.videlUrl -courseData.suggestion -courseData.questions -courseData.links"
                )
                await redis.set("allCourses", JSON.stringify(courses))
                res.status(200).json({
                    success: true,
                    courses
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
