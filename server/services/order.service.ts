import { NextFunction, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import orderModel from "../models/orderModel"

// create new order

export const newOrder = catchAsyncError(async (data: any, res: Response, next: NextFunction) => {
    const order = await orderModel.create(data)
    res.status(201).json({
        success: true,
        message: "Đã tạo đơn hàng thành công",
        order
    })
})

export const getAllOrdersService = async (res: Response) => {
    const orders = await orderModel.find().sort({ createdAt: -1 })
    res.status(201).json({
        success: true,
        orders
    })
}
