// get user by id
import { Response } from "express"
import { redis } from "../utils/redis"

export const getUserById = async (id: string, res: Response) => {
    // const user = await userModel.findById(id)
    // res.status(201).json({
    //     success: true,
    //     user
    // })
    const userJson = await redis.get(id)
    if (userJson) {
        const user = JSON.parse(userJson)
        res.status(201).json({
            success: true,
            user
        })
    }
}
