import express from 'express';
import { cashIn, cashOut, getTransactions, searchUsers } from '../controllers/transactionController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes and require agent role
router.use(protect);
router.use(authorize('agent'));

router.post('/cash-in', cashIn);
router.post('/cash-out', cashOut);
router.get('/transactions', getTransactions);
router.get('/users/search', searchUsers);

export default router;
