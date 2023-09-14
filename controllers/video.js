import mongoose from 'mongoose';
import User from '../models/User.js';
import Video from '../models/Video.js';
import createError from '../error.js';

const addVideo = async (req, res, next) => {
	try{
        const id = req.user.id;
        const newVideo =  new Video({userId: id,...req.body});
        const savedVideo = await newVideo.save();
        await  User.findByIdAndUpdate(id, {
            $addToSet: { userVideos: newVideo._id},
        });
        res.status(200).json(savedVideo);
    }catch(err){
        next(err)
    }
};

const getAllVideos = async (req, res, next) => {
	try {
		const videos = await Video.find().sort({ createdAt: -1 }).populate({
			path: 'userId',
			model: 'User',
			select: 'name img',
		});
		res.status(200).json({
			count: videos.length,
			videos,
		});
	} catch (error) {
		next(error);
	}
};
const getVideoById = async (req, res, next) => {
	try{
        const videoId = req.params.id;
		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'not a valid videoId'));

		const video = await Video.findOne({ _id: videoId }).populate({
			path: 'userId',
			model: 'User',
			select: { password: 0, __v: 0 },
		});
		if (!video) 
            return next(createError(404, 'video does not exist '));

		res.status(200).json({ ...video._doc });
    }catch(err){
        next(err)
    }
};

const viewVideo = async (req, res, next) => {
	try{
        const videoId = req.params.id;
		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'Not a valid videoId'));

		await Video.findByIdAndUpdate(videoId, {
			$inc: { views: 1 },
		});
        res.status(200).json("View increased")
    }catch(err){
        next(err)
    }
};

const getLikedVideos = async (req, res, next) => {
	try {
		const userId = req.user.id;
		let user = await User.findById(userId).populate({
			path: 'likedVideos',
			model: 'Video',
		});
		if (!user) return next(createError(404, 'user does not exists'));

		res.status(200).json({ liked: user.likedVideos });
	} catch (error) {
		next(error);
	}
};
const getDislikedVideos = async (req, res, next) => {
	try {
		const userId = req.user.id;
		let user = await User.findById(userId).populate({
			path: 'dislikedVideos',
			model: 'Video',
		});
		if (!user) return next(createError(404, 'user does not exist'));

		res.status(200).json({ disliked: user.dislikedVideos });
	} catch (error) {
		next(error);
	}
};

const getSavedVideos = async (req, res, next) => {
	try {
		const userId = req.user.id;
		let user = await User.findById(userId).populate({
			path: 'savedVideos',
			model: 'Video',
			populate: {
				path: 'userId',
				model: 'User',
				select: 'name img',
			},
		});
		if (!user) return next(createError(404, 'user does not exist'));

		res.status(200).json({ videos: user.savedVideos });
	} catch (error) {
		next(error);
	}
};
const getSubscribed = async (req, res, next) => {
	try {
		const userId = req.userData.id;
		const user = await User.findById(userId);
		const subscribed = await User.find({
			_id: { $in: user.subscripedChannels },
		}).select('userVideos');
		if (!subscribed) return res.status(200).json({ videos: [] });

		let subVideos = subscribed.map((sub) => sub.userVideos);
		subVideos = subVideos.flat();
		const videos = await Video.find({
			_id: { $in: subVideos },
		}).populate({
			path: 'userId',
			model: 'User',
			select: 'name img',
		});

		res.status(200).json({ count: videos.length, videos, subscribed });
	} catch (error) {
		next(error);
	}
};

const getTrend = async (req, res, next) => {
	try {
		const videos = await Video.find()
			.populate({
				path: 'userId',
				model: 'User',
				select: 'name img',
			})
			.sort({ views: -1 });
		res.status(200).json({ videos });
	} catch (error) {
		next(error);
    }
};
const getRandomVideos = async (req, res, next) => {
	try{
        const video = await Video.aggregate([{$sample:{size:40}}])
        res.status(200).json(video);
    }catch(err){
        next(err)
    }
};

const search = async (req, res, next) => {
	const query = req.query.q;
    try{
        const video = await Video.find({title:{$regex:query,$options:"i"}}).limit(40);
        res.status(200).json(video);
    }catch(err){
        next(err);
    }
};

const addToHistory = async (req, res, next) => {
	try {
		const videoId = req.params.id;
		const userId = req.user.id;

		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'not a valid videoId'));
		let video = await Video.findById(videoId);
		let user = await User.findById(userId);

		if (!video) return next(createError(404, 'video does not exist'));
		if (!user) return next(createError(404, 'user does not exist'));

		await User.findByIdAndUpdate(userId, { $addToSet: { history: videoId } });

		res.status(200).json('video added to watched list');
	} catch (error) {
		next(error);
	}
};

const getHistory = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).populate({
			path: 'history',
			model: 'Video',
			populate: {
				path: 'userId',
				model: 'User',
				select: 'name img',
			},
		});

		res.status(200).json({ videos: user.history });
	} catch (error) {
		next(error);
	}
};

export {
	addVideo,
	getAllVideos,
	getVideoById,
	getLikedVideos,
	getDislikedVideos,
	viewVideo,
	getSavedVideos,
	getSubscribed,
	getTrend,
	getRandomVideos,
	search,
	getHistory,
	addToHistory,
};
