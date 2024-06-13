"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAnalytics = exports.getCourseAnalytics = exports.getUserAnalytics = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const analystic_generator_1 = require("../utils/analystic.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
// get user analystic -- only for admin
exports.getUserAnalytics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const usersAnalytics = await (0, analystic_generator_1.generateLast12MonthData)(user_model_1.default);
        res.status(200).json({
            success: true,
            usersAnalytics
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getCourseAnalytics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const coursesAnalytics = await (0, analystic_generator_1.generateLast12MonthData)(course_model_1.default);
        res.status(200).json({
            success: true,
            coursesAnalytics
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getOrdersAnalytics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const ordersAnalytics = await (0, analystic_generator_1.generateLast12MonthData)(orderModel_1.default);
        res.status(200).json({
            success: true,
            ordersAnalytics
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
