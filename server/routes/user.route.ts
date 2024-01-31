import express from "express"
import {
    activateUser,
    loginUser,
    logoutUser,
    registrationUser
} from "../controllers/users.controller"
import { isAuthenticated } from "../middleware/auth"

const userRouter = express.Router()

userRouter.post("/registration", registrationUser)
userRouter.post("/activate-user", activateUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", isAuthenticated, logoutUser)

export default userRouter
