import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  likes: {
    type: Number,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
