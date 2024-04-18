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

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse)

courseRouter.get("/get-course/:id", getSingleCourse)

courseRouter.get("/get-course", getAllCourses)

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser)

courseRouter.put("/add-question", isAuthenticated, addQuestion)

courseRouter.put("/add-answer", isAuthenticated, addAnswer)

courseRouter.put("/add-review/:id", isAuthenticated, addReview)

courseRouter.put("/add-reply", isAuthenticated, authorizeRoles("admin"), addReplyToReview)

courseRouter.get("/get-courses", isAuthenticated, authorizeRoles("admin"), getAllCourses)

courseRouter.post("/getVdoCipherOTP", generateVideoUrl)

courseRouter.delete("/delete-courses/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse)

export default courseRouter
