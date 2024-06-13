"use strict";
// import mongoose from "mongoose"
// require("dotenv").config()
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const dbUrl = process.env.DB_URL || "";
const connectdb = async () => {
    try {
        await mongoose_1.default.connect(dbUrl).then((data) => {
            console.log(`Database connected with ${data.connection.host}`);
        });
    }
    catch (error) {
        console.log(error.message);
        setTimeout(connectdb, 5000);
    }
};
exports.default = connectdb;
