// import mongoose from "mongoose"
// require("dotenv").config()

// const dbURL = process.env.DB_URL || ""

// const connectDB = async () => {
//     try {
//         console.log("Connecting to database")
//         await mongoose.connect(dbURL).then((data: any) => {
//             console.log(`Database connected ${data.connection.host}`)
//         })
//     } catch (error: any) {
//         console.log(error.message)
//         setTimeout(connectDB, 5000)
//     }
// }

// export default connectDB

import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.DB_URL || "";

const connectdb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectdb, 5000);
  }
};

export default connectdb;
