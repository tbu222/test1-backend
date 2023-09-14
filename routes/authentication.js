import express from 'express';
const router = express.Router();
import { googleAuth, signIn, signUp } from '../controllers/authentication.js';

router.post('/signup', signUp);

router.post('/signin', signIn);


router.post('/googleAuth', googleAuth);


export default router;