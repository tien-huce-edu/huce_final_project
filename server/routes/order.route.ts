import { getAllOrders } from "./../controllers/order.controller"
import express from "express"
import { createOrder } from "../controllers/order.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
import { updateAccessToken } from "../controllers/users.controller"
const orderRouter = express.Router()

orderRouter.post("/create-order", isAuthenticated, createOrder)

orderRouter.get("/get-orders",updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllOrders)

export default orderRouter
