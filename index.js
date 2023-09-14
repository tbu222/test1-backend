import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/users.js';
import authRoutes from './routes/authentication.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import cookieParser from "cookie-parser"
const app = express();
dotenv.config();
const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 27017;


mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
        console.log("Running")
		app.listen(PORT);
	})
	.catch((err) => console.log(err));
Promise = global.Promise;

app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || '500 Internal Server Error';
	return res.status(status).json({
		success: false,
		status,
		message,
	});
});

app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Pages not Found',
	});
});

export default app;
