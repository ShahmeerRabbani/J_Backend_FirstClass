import mongoose from "mongoose";

const schema = mongoose.Schema({
    title: String,
    desc: String,
    postID: Number,
})

const PostModel = mongoose.model('post', schema)

export default PostModel