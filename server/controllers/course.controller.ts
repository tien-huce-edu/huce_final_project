import cloudinary from "cloudinary"
import ejs from "ejs"
import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import path from "path"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import CourseModel from "../models/course.model"
import { IUser } from "../models/user.model"
import { createCourse } from "../services/course.service"
import ErrorHandler from "../utils/ErrorHandler"
import { redis } from "../utils/redis"
import sendMail from "../utils/sendMail"

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

// get course content -- only for purchased course
export const getCourseByUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user?.courses

            const courseId = req.params.id

            const courseExist = userCourseList?.find(
                (course: any) => course._id.toString() === courseId
            )

            if (!courseExist) {
                return next(new ErrorHandler("Bạn chưa mua khóa học này!", 400))
            }

            const course = await CourseModel.findById(courseId)
            const content = course?.courseData

            res.status(200).json({
                success: true,
                content
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// add question to course

interface IAddQuestionData {
    question: string
    courseId: string
    contentId: string
}

export const addQuestion = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { question, courseId, contentId } = req.body as IAddQuestionData
            const course = await CourseModel.findById(courseId)

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Không tìm thấy khóa học!", 404))
            }
            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            )

            if (!courseContent) {
                return next(new ErrorHandler("Không tìm thấy nội dung!", 404))
            }

            const newQuestion: any = {
                user: req.user,
                question,
                questionReplies: []
            }

            courseContent.questions.push(newQuestion)

            await course?.save()

            res.status(200).json({
                success: true,
                course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// add answer to course

interface IAddAnswerData {
    answer: string
    courseId: string
    contentId: string
    questionId: string
}

export const addAnswer = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body
            const course = await CourseModel.findById(courseId)

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Không tìm thấy khóa học!", 404))
            }
            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            )

            if (!courseContent) {
                return next(new ErrorHandler("Không tìm thấy nội dung!", 404))
            }

            const question = courseContent?.questions?.find((item: any) =>
                item._id.equals(questionId)
            )

            if (!question) {
                return next(new ErrorHandler("Không tìm thấy câu hỏi!", 404))
            }

            const newAnswer: any = {
                user: req.user as IUser,
                answer
            }

            // question.questionReplies ??= [];
            question.questionReplies.push(newAnswer)

            await course?.save()

            if (req.user?._id === question.user._id) {
            } else {
                const data = {
                    name: question.user.name,
                    title: courseContent.title
                }

                const html = await ejs.renderFile(
                    path.join(__dirname, "../mails/question-reply.ejs"),
                    data
                )
                try {
                    await sendMail({
                        email: question.user.email,
                        subject: "Câu trả lời cho câu hỏi của bạn",
                        template: "question-reply.ejs",
                        data
                    })
                } catch (error: any) {
                    return next(new ErrorHandler(error.message, 500))
                }
            }
            res.status(200).json({
                success: true,
                course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// add review to course

interface IAddReviewData {
    review: string
    rating: number
    userId: string
}

export const addReview = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user?.courses

            const courseId = req.params.id

            // check course id exist in user courses list
            const courseExist = userCourseList?.some(
                (course: any) => course._id.toString() === courseId.toString()
            )
            if (!courseExist) {
                return next(new ErrorHandler("Bạn chưa mua khóa học này!", 400))
            }
            const course = await CourseModel.findById(courseId)

            const { review, rating } = req.body as IAddReviewData

            const reviewData: any = {
                user: req.user,
                comment: review,
                rating
            }
            course?.reviews.push(reviewData)
            let avg = 0

            course?.reviews.forEach((item: any) => {
                avg += item.rating
            })
            if (course) {
                course.rating = avg / course.reviews.length
            }

            await course?.save()

            const notification = {
                title: "Có người vừa đánh giá khóa học của bạn",
                message: `Khóa học ${course?.name} của bạn vừa nhận được một đánh giá mới từ ${req.user?.name}`
            }

            res.status(200).json({
                success: true,
                course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// add reply in review
interface IAddReviewData {
    comment: string
    courseId: string
    reviewId: string
}

export const addReplyToReview = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { comment, courseId, reviewId } = req.body as IAddReviewData
            const course = await CourseModel.findById(courseId)

            if (!course) {
                return next(new ErrorHandler("Không tìm thấy khóa học!", 404))
            }
            const review = course?.reviews?.find((item: any) => item._id.equals(reviewId))
            if (!review) {
                return next(new ErrorHandler("Không tìm thấy đánh giá!", 404))
            }
            const newReply: any = {
                user: req.user,
                comment
            }

            if (!review.commentReplies) {
                review.commentReplies = []
            }

            review.commentReplies.push(newReply)

            await course.save()

            res.status(200).json({
                success: true,
                course
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
