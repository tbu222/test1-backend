import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true]
    },
    title: {
        type: String,
        required: [true],
        unique: [true]
    },
    desc: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: [true]
    },
    imgUrl: {
        type: String,
        required: [true]
    },
    likes: {
        type: Number,
        default: 0,
        min: 0

    },
    dislikes: {
        type: Number,
        default: 0,
        min: 0
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
},
    { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;



