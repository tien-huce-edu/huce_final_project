require("dotenv").config()
import mongoose, { Document, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt, { Secret } from "jsonwebtoken"
import e from "express"

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// doan nay khai bao interface cho user
export interface IUser extends Document {
    name: string
    email: string
    password: string
    avatar: {
        public_id: string
        url: string
    }
    role: string
    isVerified: boolean
    courses: Array<{ courseId: string }>
    comparePassword: (password: string) => Promise<boolean>
    signAccessToken: () => string
    signRefreshToken: () => string
}

// Khai bao userSchema
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            match: [emailRegexPattern, "Please enter valid email address"],
            unique: true
        },
        password: {
            type: String,
            // required: [true, "Please enter your password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        avatar: {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
        },
        role: {
            type: String,
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        courses: [
            {
                courseId: String
            }
        ]
    },
    { timestamps: true }
)

// Hash password before saving user
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// sign access token
userSchema.methods.signAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}h`
    })
}

userSchema.methods.signRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE}d` })
}

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

const userModel: Model<IUser> = mongoose.model("User", userSchema)
export default userModel
