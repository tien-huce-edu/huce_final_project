"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analystic_controller_1 = require("../controllers/analystic.controller");
const auth_1 = require("../middleware/auth");
const analysticRouter = express_1.default.Router();
analysticRouter.get("/get-users-analytics", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), analystic_controller_1.getUserAnalytics);
analysticRouter.get("/get-courses-analytics", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), analystic_controller_1.getCourseAnalytics);
analysticRouter.get("/get-orders-analytics", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), analystic_controller_1.getOrdersAnalytics);
exports.default = analysticRouter;
