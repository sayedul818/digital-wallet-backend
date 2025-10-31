import express from 'express';
import { getWalletBalance, sendMoney, getTransactions, searchUsers } from '../controllers/transactionController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/me/wallet', getWalletBalance);
router.post('/send', authorize('user'), sendMoney);
router.get('/transactions', getTransactions);
// Allow authenticated users to search other users (for send money)
router.get('/search', searchUsers);

export default router;
