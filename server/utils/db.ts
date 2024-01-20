import mongoose from 'mongoose'
require('dotenv').config()

const dbURL = process.env.DB_URL || ''

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then((data: any) => {
      console.log(`Database connected ${data.connection.host}`)
    })
  } catch (error: any) {
    console.log(error.message)
    setTimeout(connectDB, 5000)
  }
}

export default connectDB
