import { Router } from 'express';
import { getUserProfile, followUser, unfollowUser, updateUserProfile } from '../controllers/user.controller.js';

const router = Router();

// Get user profile
router.route('/:username').get(getUserProfile);
router.route('/profile').patch(updateUserProfile);


export default router;
