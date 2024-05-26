"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
require("dotenv").config();
const cloudinary_1 = __importDefault(require("cloudinary"));
const ejs_1 = __importDefault(require("ejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_service_1 = require("../services/user.service");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
// registration controller
exports.registrationUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // check exist email in db
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email đã tồn tại!\n Vui lòng nhập email khác", 400));
        }
        // Create user variable
        const user = {
            name,
            email,
            password
        };
        // Call function create active token
        const activationToken = (0, exports.createActivationToken)(user);
        // Get Activation Code from function create active token return
        const { activationCode } = activationToken;
        // Create mail data
        const data = { user: { name: user.name }, activationCode };
        // create view in mail
        await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        // try catch mail
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Xác thực tài khoản",
                template: "activation-mail.ejs",
                data
            });
            res.status(201).json({
                success: true,
                message: `Đăng ký thành công vui lòng kiểm tra email ${user.email} để xác thực tài khoản`,
                activationToken: activationToken.token
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const createActivationToken = (user) => {
    // create activation code with random math
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    // decode userInfo and activationCode to jwt string
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode
    }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
// active controller
exports.activateUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        // encode userInfo and activationCode to jwt string
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        // check activation code in jwt string and activation code in request body is match
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Mã xác thực không đúng", 400));
        }
        const { name, email, password } = newUser.user;
        // const existUser = await userModel.findOne({ email })
        // if (existUser) {
        //   return next(new ErrorHandler('Email đã tồn tại', 400))
        // }
        const user = await user_model_1.default.create({ name, email, password });
        res.status(201).json({
            success: true,
            message: `Đăng ký thành công`,
            data: {
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// login controller
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Thông tin không được để trống", 400));
        }
        // check exist email in db
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Email không tồn tại", 400));
        }
        // check password match
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Tài khoản hoặc mật khẩu không đúng", 400));
        }
        // function send token to client
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// logout controller
exports.logoutUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        // delete token in cookie
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        // delete user in redis
        const userId = req?.user?._id;
        redis_1.redis.del(userId);
        // send response
        res.status(200).json({
            success: true,
            message: "Đăng xuất thành công"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const message = "Không tồn tại refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Hãy đăng nhập lại vì phiên đăng nhập của bạn đã hết hạn!", 400));
        }
        const user = JSON.parse(session);
        // generate new token
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m"
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d"
        });
        res.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
        // res.status(200).json({
        //     success: true,
        //     accessToken
        // })
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user info
exports.getUserInfo = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        await (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// social auth
exports.socialAuth = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = await user_model_1.default.create({ name, email, avatar: { url: avatar } });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            await user_model_1.default.findOneAndUpdate({ email }, { avatar: { url: avatar }, name });
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        // get name and email from request body
        const { name } = req.body;
        // get user id from request
        const userId = req.user?._id;
        // find user in db
        const user = await user_model_1.default.findById(userId);
        // check name and email if not null then update
        if (user && name === user.name) {
            return next(new ErrorHandler_1.default("Tên không được trùng với tên hiện tại", 400));
        }
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công",
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Thông tin mật khẩu cũ và mới không được để trống", 400));
        }
        if (oldPassword === newPassword) {
            return next(new ErrorHandler_1.default("Mật khẩu mới không được trùng với mật khẩu cũ", 400));
        }
        // find user in db
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("User không tồn tại", 400));
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Mật khẩu cũ không đúng", 400));
        }
        user.password = newPassword;
        await user.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        res.status(200).json({
            success: true,
            message: "Cập nhật mật khẩu thành công",
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateProfilePicture = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User không tồn tại", 400));
        }
        if (avatar) {
            if (user?.avatar?.public_id) {
                // delete old avatar in cloudinary
                await cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatar",
                    width: 150
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
            else {
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatar",
                    width: 150
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
        }
        await user.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            message: "Cập nhật ảnh đại diện thành công",
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all users -- only for admin
exports.getAllUsers = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user role -- only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            const id = isUserExist._id;
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete user -- only for admin
exports.deleteUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User không tồn tại", 400));
        }
        await user.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
