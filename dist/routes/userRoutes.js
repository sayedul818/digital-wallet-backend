"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protect all routes
router.use(authMiddleware_1.protect);
router.get('/me/wallet', transactionController_1.getWalletBalance);
router.post('/send', (0, authMiddleware_1.authorize)('user'), transactionController_1.sendMoney);
router.get('/transactions', transactionController_1.getTransactions);
// Allow authenticated users to search other users (for send money)
router.get('/search', transactionController_1.searchUsers);
exports.default = router;
