"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const auth_1 = require("../middleware/auth");
const users_controller_1 = require("../controllers/users.controller");
const courseRouter = express_1.default.Router();
courseRouter.post("/create-course", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.uploadCourse);
courseRouter.put("/edit-course/:id", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.editCourse);
courseRouter.get("/get-course/:id", course_controller_1.getSingleCourse);
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
courseRouter.get("/get-admin-courses", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getAdminAllCourse);
courseRouter.get("/get-course-content/:id", users_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.getCourseByUser);
courseRouter.put("/add-question", users_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.addQuestion);
courseRouter.put("/add-answer", users_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.addAnswer);
courseRouter.put("/add-review/:id", users_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.addReview);
courseRouter.put("/add-reply", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.addReplyToReview);
courseRouter.post("/getVdoCipherOTP", course_controller_1.generateVideoUrl);
courseRouter.delete("/delete-courses/:id", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.deleteCourse);
exports.default = courseRouter;
