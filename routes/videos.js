import express from 'express';
const router = express.Router();
import {verifyToken} from '../verifyToken.js';
import {
	addVideo,
	getAllVideos,
	getVideoById,
	getLikedVideos,
	getDislikedVideos,
	getSavedVideos,
	getSubscribed,
	getTrend,
	getRandomVideos,
	search,
	viewVideo,
	getHistory,
	addToHistory,
} from '../controllers/video.js';

router.post('/', verifyToken, addVideo);

router.get('/', getAllVideos);
router.get('/find/:id', getVideoById);
router.put('/view/:id', verifyToken, viewVideo);

router.get('/likes', verifyToken, getLikedVideos);
router.get('/dislikes', verifyToken, getDislikedVideos);
router.get('/saved', verifyToken, getSavedVideos);
router.get('/subscribes', verifyToken, getSubscribed);


router.get('/trend', getTrend);
router.get('/random', getRandomVideos);

router.get('/search', search);

router.get('/history', verifyToken, getHistory);
router.put('/history/:id', verifyToken, addToHistory);

export default router;
