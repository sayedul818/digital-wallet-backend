"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protect all routes and require admin role
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)('admin'));
router.get('/overview', adminController_1.getDashboardOverview);
router.get('/users', adminController_1.getAllUsers);
router.patch('/users/:id/status', adminController_1.updateUserStatus);
router.post('/users/:id/credit', adminController_1.creditUserByAdmin);
router.patch('/agents/:id/approve', adminController_1.approveAgent);
router.get('/transactions', adminController_1.getAllTransactions);
exports.default = router;
