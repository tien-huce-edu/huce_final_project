import express from "express"
import {
    addAnswer,
    addQuestion,
    addReplyToReview,
    addReview,
    editCourse,
    getAllCourses,
    getCourseByUser,
    getSingleCourse,
    uploadCourse,
    deleteCourse,
    generateVideoUrl
} from "../controllers/course.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
import { updateAccessToken } from "../controllers/users.controller"
const courseRouter = express.Router()

courseRouter.post(
    "/create-course",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    uploadCourse
)

courseRouter.put(
    "/edit-course/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    editCourse
)

courseRouter.get("/get-course/:id", getSingleCourse)

courseRouter.get("/get-courses", getAllCourses)

courseRouter.get("/get-course-content/:id", updateAccessToken, isAuthenticated, getCourseByUser)

courseRouter.put("/add-question", updateAccessToken, isAuthenticated, addQuestion)

courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer)

courseRouter.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview)

courseRouter.put(
    "/add-reply",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    addReplyToReview
)

courseRouter.post("/getVdoCipherOTP", generateVideoUrl)

courseRouter.delete(
    "/delete-courses/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCourse
)

export default courseRouter
