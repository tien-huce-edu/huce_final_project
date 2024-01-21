require('dotenv').config()
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { catchAsyncError } from '../middleware/catchAsyncErrors'
import userModel from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import ejs from 'ejs'
import path from 'path'
import { send } from 'process'
import sendMail from '../utils/sendMail'

// register user
interface IRegistrationBody {
  name: string
  email: string
  password: string
  avatar?: string
}

export const registrationUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password }: IRegistrationBody = req.body

    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
      return next(new ErrorHandler('Email already exist', 400))
    }
    const user: IRegistrationBody = {
      name,
      email,
      password
    }

    const activationToken = createActivationToken(user)
    const { activationCode } = activationToken
    const data = { user: { name: user.name }, activationCode }
    await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data)

    try {
      await sendMail({
        email: user.email,
        subject: 'Xác thực tài khoản',
        template: 'activation-mail.ejs',
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
})

interface IActivationToken {
  token: string
  activationCode: string
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: '10m' })
  return { token, activationCode }
}
