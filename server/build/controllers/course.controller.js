"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourse = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const ejs_1 = __importDefault(require("ejs"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const course_model_1 = __importDefault(require("../models/course.model"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const course_service_1 = require("../services/course.service");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const redis_1 = require("../utils/redis");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
// Upload course controller
exports.uploadCourse = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "course"
            });
            data.thumbnail = {
                url: myCloud.secure_url,
                public_id: myCloud.public_id
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update course controller
exports.editCourse = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = (await course_model_1.default.findById(courseId));
        if (thumbnail && !thumbnail.startsWith("https")) {
            // await cloudinary.v2.uploader.destroy(data.thumbnail.public_id)
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "course"
            });
            data.thumbnail = {
                url: myCloud.secure_url,
                public_id: myCloud.public_id
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                url: thumbnail,
                public_id: courseData.thumbnail.public_id
            };
        }
        const course = await course_model_1.default.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            await redis_1.redis.set(courseId, JSON.stringify(course));
        }
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get single course without purchasing controller
exports.getSingleCourse = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            const courseInDb = await course_model_1.default.findById(req.params.id);
            if (JSON.stringify(courseInDb) === isCacheExist) {
                return res.status(200).json({
                    success: true,
                    course: JSON.parse(isCacheExist)
                });
            }
            else {
                const course = await course_model_1.default.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
                await redis_1.redis.set(courseId, JSON.stringify(course));
                if (!course) {
                    return next(new ErrorHandler_1.default("Không tìm thấy khóa học!", 404));
                }
                res.status(200).json({
                    success: true,
                    course
                });
            }
        }
        else {
            const course = await course_model_1.default.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set(courseId, JSON.stringify(course));
            if (!course) {
                return next(new ErrorHandler_1.default("Không tìm thấy khóa học!", 404));
            }
            res.status(200).json({
                success: true,
                course
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get all courses without purchasing controller
exports.getAllCourses = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const courses = await course_model_1.default.find().select("-courseData.videlUrl -courseData.suggestion -courseData.questions -courseData.links");
        // await redis.set("allCourses", JSON.stringify(courses), "EX", 60 * 5)
        res.status(200).json({
            success: true,
            courses
        });
        // }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get course content -- only for purchased course
exports.getCourseByUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExist) {
            return next(new ErrorHandler_1.default("Bạn chưa mua khóa học này!", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        const content = course?.courseData;
        res.status(200).json({
            success: true,
            content
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addQuestion = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Không tìm thấy khóa học!", 404));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Không tìm thấy nội dung!", 404));
        }
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: []
        };
        courseContent.questions.push(newQuestion);
        await notificationModel_1.default.create({
            userId: req.user?._id,
            title: "Câu hỏi mới trong khóa học của bạn",
            message: `${req.user?.name} đã đặt câu hỏi mới trong khoá học của bạn ${course?.name}`
        });
        await course?.save();
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addAnswer = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Không tìm thấy khóa học!", 404));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Không tìm thấy nội dung!", 404));
        }
        const question = courseContent?.questions?.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default("Không tìm thấy câu hỏi!", 404));
        }
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // question.questionReplies ??= [];
        question.questionReplies.push(newAnswer);
        await course?.save();
        if (req.user?._id === question.user._id) {
            await notificationModel_1.default.create({
                userId: req.user?._id,
                title: "Câu trả lời cho câu hỏi của bạn",
                message: `Câu hỏi của bạn trong khoá học ${course?.name} vừa nhận được một câu trả lời mới`
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Câu trả lời cho câu hỏi của bạn",
                    template: "question-reply.ejs",
                    data
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        // check course id exist in user courses list
        const courseExist = userCourseList?.some((course) => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return next(new ErrorHandler_1.default("Bạn chưa mua khóa học này!", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating
        };
        course?.reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((item) => {
            avg += item.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length;
        }
        await course?.save();
        await notificationModel_1.default.create({
            userId: req.user?._id,
            title: "Có người vừa đánh giá khóa học của bạn",
            message: `Khóa học ${course?.name} của bạn vừa nhận được một đánh giá mới từ ${req.user?.name}`
        });
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReplyToReview = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Không tìm thấy khóa học!", 404));
        }
        const review = course?.reviews?.find((item) => item._id.equals(reviewId));
        if (!review) {
            return next(new ErrorHandler_1.default("Không tìm thấy đánh giá!", 404));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies.push(replyData);
        await course.save();
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get all courses -- only for admin
exports.getAdminAllCourse = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete course -- only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("course không tồn tại", 400));
        }
        await course.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "course deleted successfully."
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.generateVideoUrl = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
            }
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
