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
   unblockUser,
   updateUserAvatar,
   deleteUserAvatar
} from '../controllers/user.controller.js';

import { verifyJWT } from '../middleware/jwtVerify.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

// Static
router
   .route('/suggestions')
   .get(verifyJWT, getUserSuggestions);
router
   .route('/search')
   .get(verifyJWT, searchUsers);
router
   .route('/profile')
   .patch(verifyJWT, upload.single("avatar"), updateUserProfile);
router
   .route('/update-avatar')
   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
   .route('/delete-avatar')
   .delete(verifyJWT, deleteUserAvatar);

// dynamic
router
   .route('/:username')
   .get(getUserProfile);
router
   .route('/follow/:id')
   .get(verifyJWT, followUser);
router
   .route('/unfollow/:id')
   .get(verifyJWT, unfollowUser);
router
   .route('/get-followers/:id')
   .get(verifyJWT, getUserFollowers);
router
   .route('/get-following/:id')
   .get(verifyJWT, getUserFollowing);
router
   .route('/get-blocked/:id')
   .get(verifyJWT, blockUser);
router
   .route('/get-unblocked/:id')
   .get(verifyJWT, unblockUser);

export default router;
