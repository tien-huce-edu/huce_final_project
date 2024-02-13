import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service"

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
