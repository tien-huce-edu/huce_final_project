"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpire = exports.accessTokenExpire = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// parse environtment variable to integrate with fallback values
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300");
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200");
// options for cookie
exports.accessTokenOptions = {
    experies: new Date(Date.now() + exports.accessTokenExpire * 60 * 60 * 1000),
    maxAge: exports.accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax"
};
exports.refreshTokenOptions = {
    experies: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax"
};
const sendToken = (user, statusCode, res) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    // set user to redis
    redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
        exports.refreshTokenOptions.secure = true;
    }
    // response cookie and json
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
exports.sendToken = sendToken;
