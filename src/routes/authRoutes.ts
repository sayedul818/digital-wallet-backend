import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { registerValidation, loginValidation, profileUpdateValidation } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, updateProfile);

export default router;
