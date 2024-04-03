require("dotenv").config()
import cloudinary from "cloudinary"
import ejs from "ejs"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import path from "path"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import userModel, { IUser } from "../models/user.model"
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service"
import ErrorHandler from "../utils/ErrorHandler"
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt"
import { redis } from "../utils/redis"
import sendMail from "../utils/sendMail"

// register user
interface IRegistrationBody {
    name: string
    email: string
    password: string
    avatar?: string
}

// registration controller
export const registrationUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password }: IRegistrationBody = req.body

            // check exist email in db
            const isEmailExist = await userModel.findOne({ email })
            if (isEmailExist) {
                return next(new ErrorHandler("Email đã tồn tại!\n Vui lòng nhập email khác", 400))
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
            await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data)
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

// active controller
export const activateUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } = req.body as IActivationRequest

            // encode userInfo and activationCode to jwt string
            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string }

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

// login controller
export const loginUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginBody
            if (!email || !password) {
                return next(new ErrorHandler("Thông tin không được để trống", 400))
            }
            // check exist email in db
            const user = await userModel.findOne({ email }).select("+password")
            if (!user) {
                return next(new ErrorHandler("Email không tồn tại", 400))
            }
            // check password match
            const isPasswordMatch = await user.comparePassword(password)
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Tài khoản hoặc mật khẩu không đúng", 400))
            }
            // function send token to client
            sendToken(user, 200, res)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// logout controller
export const logoutUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // delete token in cookie
            res.cookie("access_token", "", { maxAge: 1 })
            res.cookie("refresh_token", "", { maxAge: 1 })
            // delete user in redis
            const userId = req?.user?._id
            redis.del(userId)
            // send response
            res.status(200).json({
                success: true,
                message: "Đăng xuất thành công"
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// update access token
export const updateAccessToken = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.cookies.refresh_token as string
            const decoded = jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN as string
            ) as JwtPayload
            const message = "Không tồn tại refresh token"
            if (!decoded) {
                return next(new ErrorHandler(message, 400))
            }
            const session = await redis.get(decoded.id as string)
            if (!session) {
                return next(
                    new ErrorHandler(
                        "Hãy đăng nhập lại vì phiên đăng nhập của bạn đã hết hạn!",
                        400
                    )
                )
            }
            const user = JSON.parse(session)
            // generate new token
            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
                expiresIn: "5m"
            })
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
                expiresIn: "3d"
            })

            req.user = user
            res.cookie("access_token", accessToken, accessTokenOptions)
            res.cookie("refresh_token", refreshToken, refreshTokenOptions)

            await redis.set(user._id, JSON.stringify(user), "EX", 604800)

            res.status(200).json({
                success: true,
                accessToken
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// get user info
export const getUserInfo = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id
            await getUserById(userId as string, res)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

interface ISocialAuthBody {
    email: string
    name: string
    avatar: string
}

// social auth
export const socialAuth = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, avatar } = req.body as ISocialAuthBody
            const user = await userModel.findOne({ email })
            if (!user) {
                const newUser = await userModel.create({ name, email, avatar })
                sendToken(newUser, 200, res)
            } else {
                sendToken(user, 200, res)
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// update user info
interface IUpdateUserInfo {
    name?: string
    email?: string
}

export const updateUserInfo = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get name and email from request body
            const { name, email } = req.body as IUpdateUserInfo
            // get user id from request
            const userId = req.user?._id
            // find user in db
            const user = await userModel.findById(userId)
            // check name and email if not null then update
            if (email && user) {
                const isEmailExist = await userModel.findOne({ email })
                if (isEmailExist) {
                    return next(new ErrorHandler("Email đã tồn tại", 400))
                }
                user.email = email
            }
            if (name && user) {
                user.name = name
            }
            await user?.save()
            await redis.set(userId, JSON.stringify(user))
            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin thành công",
                user
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// update user password
interface IUpdatePassword {
    oldPassword: string
    newPassword: string
}

export const updatePassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body as IUpdatePassword

            if (!oldPassword || !newPassword) {
                return next(
                    new ErrorHandler("Thông tin mật khẩu cũ và mới không được để trống", 400)
                )
            }

            // find user in db
            const user = await userModel.findById(req.user?._id).select("+password")
            if (user?.password === undefined) {
                return next(new ErrorHandler("User không tồn tại", 400))
            }
            const isPasswordMatch = await user?.comparePassword(oldPassword)
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Mật khẩu cũ không đúng", 400))
            }
            user.password = newPassword
            await user.save()
            await redis.set(req.user?._id, JSON.stringify(user))
            res.status(200).json({
                success: true,
                message: "Cập nhật mật khẩu thành công",
                user
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// update profile picture
interface IUpdateProfilePicture {
    avatar: string
}

export const updateProfilePicture = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body as IUpdateProfilePicture
            const userId = req.user?._id
            const user = await userModel.findById(userId)
            if (!user) {
                return next(new ErrorHandler("User không tồn tại", 400))
            }
            if (avatar) {
                if (user?.avatar?.public_id) {
                    // delete old avatar in cloudinary
                    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
                    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                        folder: "avatar",
                        width: 150
                    })
                    user.avatar = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    }
                } else {
                    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                        folder: "avatar",
                        width: 150
                    })
                    user.avatar = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    }
                }
            }
            await user.save()
            await redis.set(userId, JSON.stringify(user))
            res.status(200).json({
                success: true,
                message: "Cập nhật ảnh đại diện thành công",
                user
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// get all users -- only for admin

export const getAllUsers = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllUsersService(res)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// update user role -- only for admin
export const updateUserRole = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, role } = req.body
            updateUserRoleService(res, id, role)
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// delete user -- only for admin
export const deleteUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const user = await userModel.findById(id)

            if (!user) {
                return next(new ErrorHandler("User không tồn tại", 400))
            }

            await user.deleteOne({ id })

            await redis.del(id)

            res.status(200).json({
                success: true,
                message: "User deleted successfully."
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)
