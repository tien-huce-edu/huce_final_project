import express from "express"
import {
    getCourseAnalytics,
    getOrdersAnalytics,
    getUserAnalytics
} from "../controllers/analystic.controller"
import { isAuthenticated, authorizeRoles } from "../middleware/auth"

const analysticRouter = express.Router()

analysticRouter.get(
    "/get-users-analytics",
    isAuthenticated,
    authorizeRoles("admin"),
    getUserAnalytics
)

analysticRouter.get(
    "/get-courses-analytics",
    isAuthenticated,
    authorizeRoles("admin"),
    getCourseAnalytics
)

analysticRouter.get(
    "/get-orders-analytics",
    isAuthenticated,
    authorizeRoles("admin"),
    getOrdersAnalytics
)

export default analysticRouter
