"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const node_cron_1 = __importDefault(require("node-cron"));
// Create notification only for admin
exports.getNotifications = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const notifications = await notificationModel_1.default.find().sort({
            createdAt: -1
        });
        res.status(200).json({
            success: true,
            notifications
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update notification
exports.updateNotification = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        const notification = await notificationModel_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Không tìm thấy thông báo", 404));
        }
        notification.status = "read";
        await notification.save();
        const notifications = await notificationModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notifications
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete notification -- only for admin
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationModel_1.default.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
    console.log("delete notification 30 days ago");
});
