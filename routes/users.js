import express from 'express';
const router = express.Router();
import {
    getAllUsers,
    getUserById,
    subscribeUser,
    likeVideo,
    dislikeVideo,
    saveVideo,
    unsaveVideo
} from '../controllers/user.js';
import {verifyToken} from '../verifyToken.js';

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.put('/subscribe/:id', verifyToken, subscribeUser);


router.put('/like/:id', verifyToken, likeVideo);
router.put('/dislike/:id', verifyToken, dislikeVideo);

router.put('/save/:id', verifyToken, saveVideo);
router.put('/unsave/:id', verifyToken, unsaveVideo);

export default router;