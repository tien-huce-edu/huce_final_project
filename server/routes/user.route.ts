import express from 'express'
import { registrationUser } from '../controllers/users.controller'

const userRouter = express.Router()

userRouter.post('/registration', registrationUser)

export default userRouter
