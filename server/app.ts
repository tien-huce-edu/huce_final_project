require('dotenv').config()
import express, { NextFunction, Request, Response } from 'express'
export const app = express()

import cors from 'cors'
import cookieParser from 'cookie-parser'

// body parser
app.use(express.json({ limit: '50mb' }))

// cookie parser
app.use(cookieParser())

// cors => resourse sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
)

// testing route
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'API Working'
  })
})

// Unknow route

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`)
  err['status'] = 404
  next(err)
})
