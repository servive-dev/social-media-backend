import { Router } from 'express';

import { 
   getUserProfile, 
   followUser, 
   unfollowUser, 
   updateUserProfile, 
   getUserSuggestions,
   searchUsers,
   getUserFollowers,
   getUserFollowing,
   blockUser,
   unblockUser
} from '../controllers/user.controller.js';

import { verifyJWT } from '../middleware/jwtVerify.middleware.js';

const router = Router();

// Get user profile
router.route('/suggestions').get(verifyJWT, getUserSuggestions);
router.route('/search').get(verifyJWT, searchUsers);
router.route('/profile').patch(verifyJWT, updateUserProfile);

// 
router.route('/:username').get(getUserProfile);
router.route('/follow/:id').get(verifyJWT, followUser);
router.route('/unfollow/:id').get(verifyJWT, unfollowUser);
router.route('/get-followers/:id').get(verifyJWT, getUserFollowers);
router.route('/get-following/:id').get(verifyJWT, getUserFollowing);
router.route('/get-blocked/:id').get(verifyJWT, blockUser);
router.route('/get-unblocked/:id').get(verifyJWT, unblockUser);

export default router;
