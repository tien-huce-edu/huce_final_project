require("dotenv").config()
import { NextFunction, Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import userModel, { Iuser } from "../models/user.model"
import ErrorHandler from "../utils/ErrorHandler"
import ejs from "ejs"
import path from "path"
import { send } from "process"
import sendMail from "../utils/sendMail"
import { sendToken } from "../utils/jwt"
import { redis } from "../utils/redis"

// register user
interface IRegistrationBody {
    name: string
    email: string
    password: string
    avatar?: string
}

export const registrationUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password }: IRegistrationBody = req.body

            // check exist email in db
            const isEmailExist = await userModel.findOne({ email })
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exist", 400))
            }

            // Create user variable
            const user: IRegistrationBody = {
                name,
                email,
                password
            }

            // Call function create active token
            const activationToken = createActivationToken(user)
            // Get Activation Code from function create active token return
            const { activationCode } = activationToken
            // Create mail data
            const data = { user: { name: user.name }, activationCode }
            // create view in mail
            await ejs.renderFile(
                path.join(__dirname, "../mails/activation-mail.ejs"),
                data
            )
            // try catch mail
            try {
                await sendMail({
                    email: user.email,
                    subject: "Xác thực tài khoản",
                    template: "activation-mail.ejs",
                    data
                })
                res.status(201).json({
                    success: true,
                    message: `Đăng ký thành công vui lòng kiểm tra email ${user.email} để xác thực tài khoản`,
                    activationToken: activationToken.token
                })
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500))
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

interface IActivationToken {
    token: string
    activationCode: string
}
export const createActivationToken = (user: any): IActivationToken => {
    // create activation code with random math
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    // decode userInfo and activationCode to jwt string
    const token = jwt.sign(
        {
            user,
            activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: "5m" }
    )
    return { token, activationCode }
}

// active user
interface IActivationRequest {
    activation_token: string
    activation_code: string
}

export const activateUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } =
                req.body as IActivationRequest

            // encode userInfo and activationCode to jwt string
            const newUser: { user: Iuser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: Iuser; activationCode: string }

            // check activation code in jwt string and activation code in request body is match
            if (newUser.activationCode !== activation_code) {
                return next(new ErrorHandler("Mã xác thực không đúng", 400))
            }
            const { name, email, password } = newUser.user
            // const existUser = await userModel.findOne({ email })
            // if (existUser) {
            //   return next(new ErrorHandler('Email đã tồn tại', 400))
            // }
            const user = await userModel.create({ name, email, password })
            res.status(201).json({
                success: true,
                message: `Đăng ký thành công`,
                data: {
                    name: user.name,
                    email: user.email
                }
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// login user
interface ILoginBody {
    email: string
    password: string
}

export const loginUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginBody
            if (!email || !password) {
                return next(
                    new ErrorHandler("Thông tin không được để trống", 400)
                )
            }
            // check exist email in db
            const user = await userModel.findOne({ email }).select("+password")
            if (!user) {
                return next(new ErrorHandler("Email không tồn tại", 400))
            }
            // check password match
            const isPasswordMatch = await user.comparePassword(password)
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Mật khẩu không đúng", 400))
            }
            // function send token to client
            sendToken(user, 200, res)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

export const logoutUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.cookie("access_token", "", { maxAge: 1 })
            res.cookie("refresh_token", "", { maxAge: 1 })
            const userId = req.user?._id
            redis.del(userId)
            res.status(200).json({
                success: true,
                message: "Đăng xuất thành công"
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)
