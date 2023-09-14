import jwt from 'jsonwebtoken';
import createError from './error.js';

// Verify
export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;
	console.log(token);
	const JWT_KEY = process.env.JWT || 'secret key';
	if (!token) next(createError(401, 'No token provided'));

	try {
		const decoded = jwt.verify(token, JWT_KEY);
		req.userData = decoded;
		next();
	} catch (err) {
		next(err);
	}
};

