import express from "express"
import {
    activateUser,
    getUserInfo,
    loginUser,
    logoutUser,
    registrationUser,
    updateAccessToken
} from "../controllers/users.controller"
import { isAuthenticated } from "../middleware/auth"

const userRouter = express.Router()

userRouter.post("/registration", registrationUser)
userRouter.post("/activate-user", activateUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", isAuthenticated, logoutUser)
userRouter.get("/refreshtoken", updateAccessToken)
userRouter.get("/me", isAuthenticated, getUserInfo)

export default userRouter
