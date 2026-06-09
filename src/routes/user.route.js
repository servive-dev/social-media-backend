import { Router } from 'express';

import { 
   getUserProfile, 
   followUser, 
   unfollowUser, 
   updateUserProfile, 
   getUserSuggestions,
   searchUsers
} from '../controllers/user.controller.js';

import { verifyJWT } from '../middleware/jwtVerify.middleware.js';

const router = Router();

// Get user profile
router.route('/suggestions').get(verifyJWT, getUserSuggestions);
router.route('/search').get(verifyJWT, searchUsers);
router.route('/profile').patch(verifyJWT, updateUserProfile);

// 
router.route('/:username').get(getUserProfile);


export default router;
