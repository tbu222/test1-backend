import mongoose from "mongoose";
import User from "../models/User.js";
import Video from "../models/Video.js";
import createError from "../error.js";


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            count: users.length,
            users
        })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try{
        const userId = req.params.id;
        if (!userId || !mongoose.isValidObjectId(userId))
            return next(createError(401, 'not a valid userId'))
        const user = await User.findOne({ _id: userId });
        if (!user) 
            return next(createError(404, 'user does not exist'))
        res.status(200).json({ user })
    }catch(err){
        next(err)
    }
}

const subscribeUser = async (req, res, next) => {
    try{
        const otherId = req.params.id;
        const personalId = req.user.id;
        if (!otherId || !mongoose.isValidObjectId(otherId))
            return next(createError(401, 'not a valid id'))

        let other = await User.findById(otherId);
        let  personal = await User.findById(personalId);
        if (!other || !personal)
            return next(createError(404,'user does not exist'));
        if (personal.subscribedUsers.includes(otherId)){
            await User.findByIdAndUpdate(otherId, {$inc: {subscribers:  -1}})
            await User.findByIdAndUpdate(personalId, {$pull:{ subscribedUsers: otherId}})
            return res.status(200).json("unsubscribe");
        }
        else {
            await User.findByIdAndUpdate(otherId, {$inc: {subscribers:  1}})
            await User.findByIdAndUpdate(personalId, {$addToSet:{ subscribedUsers: otherId}})
            return res.status(200).json("subscribed");
        }
    }catch(err){
        next(err)
    }
}

const likeVideo = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401), 'not a valid videoId');
        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(401), 'video or user does not exist');
            
        if (!user.likedVideos.includes(videoId) && !user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: 1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {likedVideos: videoId}})
            res.status(200).json("Liked");
        }
        else if (!user.likedVideos.includes(videoId) && user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: 1}})
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: -1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {likedVideos: videoId}})
            res.status(200).json("Liked");
        }
        else{
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: -1}})
            await User.findByIdAndUpdate(userId, {$pull: {likedVideos: videoId}})
            res.status(200).json("Unliked");
        }
    }catch(err){
        next(err)
    }
}
const dislikeVideo = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401), 'not a valid videoId');
        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(401), 'video or user does not exist');
            
        if (!user.likedVideos.includes(videoId) && !user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: 1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {dislikedVideos: videoId}})
            res.status(200).json("DisLiked");
        }
        else if (!user.dislikedVideos.includes(videoId) && user.likedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: 1}})
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: -1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {dislikedVideos: videoId}})
            res.status(200).json("DisLiked");
        }
        else{
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: -1}})
            await User.findByIdAndUpdate(userId, {$pull: {dislikedVideos: videoId}})
            res.status(200).json("UnDisliked");
        }
    }catch(err){
        next(err)
    }
}
const saveVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'not a valid videoId'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user does not exist'))

        if (user.savedVideos.includes(videoId)) {
            await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
            res.status(200).json("Remove from Saved Video");
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { savedVideos: videoId } })
            res.status(200).json("Add to Saved Videos");
        }
    } catch (error) {
        next(error)
    }
}
const unsaveVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'not a valid videoId'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user does not exist'))

        if (!user.savedVideos.includes(videoId))
            return next(createError(400, 'Video not in Saved Videos'));


        await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
        res.status(200).json("Remove from Saved Video");
    } catch (error) {
        next(error)
    }
}



export {
    getAllUsers,
    getUserById,
    subscribeUser,
    likeVideo,
    dislikeVideo,
    saveVideo,
    unsaveVideo
} 