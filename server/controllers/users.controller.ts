require('dotenv').config()
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { catchAsyncError } from '../middleware/catchAsyncErrors'
import userModel, { Iuser } from '../models/user.model'
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

    // check exist email in db
    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
      return next(new ErrorHandler('Email already exist', 400))
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
    await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data)
    // try catch mail
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
  // create activation code with random math
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  // decode userInfo and activationCode to jwt string
  const token = jwt.sign(
    {
      user,
      activationCode
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: '5m' }
  )
  return { token, activationCode }
}

// active user
interface IActivationRequest {
  activation_token: string
  activation_code: string
}

export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code } = req.body as IActivationRequest

    // encode userInfo and activationCode to jwt string
    const newUser: { user: Iuser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as string
    ) as { user: Iuser; activationCode: string }

    // check activation code in jwt string and activation code in request body is match
    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler('Mã xác thực không đúng', 400))
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
})
