"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const layout_controller_1 = require("../controllers/layout.controller");
const users_controller_1 = require("../controllers/users.controller");
const layoutRouter = express_1.default.Router();
layoutRouter.post("/create-layout", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layout_controller_1.createLayout);
layoutRouter.put("/edit-layout", users_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layout_controller_1.editLayout);
layoutRouter.get("/get-layout/:type", layout_controller_1.getLayoutByType);
exports.default = layoutRouter;
