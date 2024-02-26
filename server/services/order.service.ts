import { NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler"
import orderModel from "../models/orderModel"

// create new order

export const newOrder = catchAsyncError(async (data: any, next: NextFunction) => {
   const order = await orderModel.create(data)
   next(order)
})
