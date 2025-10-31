"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protect all routes and require agent role
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)('agent'));
router.post('/cash-in', transactionController_1.cashIn);
router.post('/cash-out', transactionController_1.cashOut);
router.get('/transactions', transactionController_1.getTransactions);
router.get('/users/search', transactionController_1.searchUsers);
exports.default = router;
