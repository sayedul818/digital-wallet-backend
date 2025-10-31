import express from 'express';
import { getDashboardOverview, getAllUsers, updateUserStatus, approveAgent, getAllTransactions, creditUserByAdmin } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getDashboardOverview);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.post('/users/:id/credit', creditUserByAdmin);
router.patch('/agents/:id/approve', approveAgent);
router.get('/transactions', getAllTransactions);

export default router;
