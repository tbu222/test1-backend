import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required:true,
            unique:true,
		},
		email: {
			type: String,
			required: [true],
			unique: [true],
		},
		password: {
			type: String,
			minlength: [6],
			required: [true],
		},
		img: {
			type: String,
		},
		subscribedChannels: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			default: [],
		},
		subscribers: {
			type: Number,
			default: 0,
			min: 0,
		},
		likedVideos: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
			default: [],
		},
		dislikedVideos: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
			default: [],
		},
		savedVideos: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
			default: [],
		},
		userVideos: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
			default: [],
		},
		history: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
			default: [],
		},
	},
	{ timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
