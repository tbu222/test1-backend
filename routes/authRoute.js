import express from 'express';
const router = express.Router();
import { googleAuth, login, singup } from '../controllers/authController.js';

router.post('/signup', singup);

router.post('/login', login);


router.post('/googleAuth', googleAuth);


export default router;