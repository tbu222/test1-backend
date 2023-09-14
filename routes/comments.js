import express from 'express';
const router = express.Router();
import {verifyToken} from '../verifyToken.js';
import { addComment, deleteComment, getAllComments } from '../controllers/comment.js';



router.get('/:videoId', getAllComments);
router.post('/:videoId', verifyToken, addComment);
router.delete('/:id', verifyToken, deleteComment);


export default router;