require("dotenv").config()
import { NextFunction, Request, Response } from "express"
import { Iuser } from "../models/user.model"
import { redis } from "./redis"

interface IActivationToken {
    experies: Date
    maxAge: number
    httpOnly: boolean
    sameSite: "none" | "strict" | "lax" | undefined
    secure?: boolean
}

export const sendToken = (user: Iuser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken()
    const refreshToken = user.signRefreshToken()

    // set user to redis
    redis.set(user._id, JSON.stringify(user))

    // parse environtment variable to integrate with fallback values
    const accessTokenExpire = parseInt(
        process.env.ACCESS_TOKEN_EXPIRE || "300",
        10
    )
    const refreshTokenExpire = parseInt(
        process.env.REFRESH_TOKEN_EXPIRE || "1200",
        10
    )
    // options for cookie
    const accessTokenOptions: IActivationToken = {
        experies: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax"
    }
    const refreshTokenOptions: IActivationToken = {
        experies: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax"
    }
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true
    }
    // response cookie and json
    res.cookie("access_token", accessToken, accessTokenOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenOptions)
    const newUser = JSON.parse(JSON.stringify(user))
    delete newUser.password
    res.status(statusCode).json({
        success: true,
        newUser,
        accessToken
    })
}