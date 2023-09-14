import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from '../error.js';

export const signUp = async (req,res, next) => {
    try {
		let pass = req.body.password;
		let { email, name } = req.body;
		if (!email || !pass || !name)
			return next(createError(400, 'Email, name , and password are required'));

		let user = await User.findOne({ email });
		if (user) return next(createError(409, 'User already exists'));

		const hash = bcrypt.hashSync(pass);
		user = new User({ ...req.body, password: hash });
		const savedUser = await user.save();

		let { password, ...other } = savedUser._doc;
		res.status(200).json({ user: other });
	} catch (error) {
		next(error);
	}
};

export const signIn = async (req,res, next) => {
    try {
		console.log(req.body);
		let email = req.body.email;
		let pass = req.body.password;
		if (!email || !pass)
			return next(createError(400, 'Email , and password are required'));

		const user = await User.findOne({ email });
		if (!user) return next(createError(404, 'User not found'));

		const isMatch =
			bcrypt.compareSync(pass, user.password) || pass === user.password;

		if (!isMatch) return next(createError(401, 'Invalid password'));

		const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
			expiresIn: '24h',
		});
		const { password, ...other } = user._doc;
		res.status(200).json({
			message: 'Login successful',
			token: token,
			user: other,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const googleAuth = async (req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(user) {
            const token = jwt.sign({id:user._id}, process.env.JWT)
            res.cookie("access_token", token,{
                httpOnly:true,
            }).status(200).json(user._doc);
        }
        else {
            const newUser= new User({...req.body,fromGoogle:true});
            const savedUser = await newUser.save();
            const token = jwt.sign({id:savedUser._id}, process.env.JWT)
            res.cookie("access_token", token,{
                httpOnly:true,
            }).status(200).json(savedUser._doc);
        }
    }catch(err){
        next(err);
    }
}

