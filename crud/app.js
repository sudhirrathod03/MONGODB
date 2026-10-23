import mongoose from "mongoose";
import Post from "../model/postModel.js";
import { errorHandler } from "../middleware/errorMiddleware.js";

import express from "express";
const app = express();
app.use(express.json());
const start = async () => {
  try {
    const connection = await mongoose.connect("mongodb://localhost:27017/crud");
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
  }
};

//get all posts
app.get("/posts", async (req, res, next) => {
  try {
    throw new Error("custom error");
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
    // res.status(500).json({message:error.message})
  }
});

//fetch single post
app.get("/posts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message:"not valid id"})
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error);
  }
});

//create post

app.post("/posts", async (req, res, next) => {
  try {
    const { title, description, likes } = req.body;

    if (!title || !description || !likes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPost = await Post.create({
      title,
      description,
      likes,
    });

    res.status(201).json({ message: "new post created", newPost });
  } catch (error) {
    next(error);
  }
});

app.put("/posts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, description, likes } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description, likes },
      {
        runValidators: true,
        new: true,
      },
    );

    res.status(200).json({ message: "POST UPDATED", updatedPost });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error);
  }
});

app.delete("/posts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "POST deleted", deletedPost });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error);
  }
});

start();
app.use(errorHandler);
app.listen(8080, () => {
  console.log("listening to port 8080");
});
