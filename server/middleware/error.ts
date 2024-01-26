import e from "express"
import ErrorHandler from "../utils/ErrorHandler"

export const ErrorMiddleware = (err: any, req: any, res: any, next: any) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // Mongo Error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }
    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }
    // wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try Again!!!"
        err = new ErrorHandler(message, 400)
    }

    // JWT Expired error
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired. Try Again!!!"
        err = new ErrorHandler(message, 400)
    }

    // filter error done respone to client
    process.env.NODE_ENV === "production"
        ? res.status(err.statusCode).json({
              success: false,
              message: err.message
          })
        : res.status(err.statusCode).json({
              success: false,
              message: err.message,
              stack: err.stack
          })
}
