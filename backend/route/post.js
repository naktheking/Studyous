import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const {person, title, location, date, startTime, endTime } = req.body;

    const user = await User_account.findOne({ username: person });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "user not found" });
    }

    user.posts.push({ title, location, date, startTime, endTime });
    await user.save();

    const createdPost = user.posts[user.posts.length - 1];
    console.log("Post created successfully");
    res.json(createdPost);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-post", async (req, res) => {
  try {
    const { username, person } = req.query;
    const resolvedUsername = username || person;
    const user = await User_account.findOne({ username: resolvedUsername });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "user not found" });
    }

    // Delete posts with end dates in the past
    const now = new Date();
    user.posts = user.posts.filter(post => {
      const postDateTime = new Date(`${post.date} ${post.endTime}`);
      return postDateTime > now;
    });
    await user.save();

    console.log("Posts retrieved successfully");
    res.json(user.posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/like-post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ error: "Post not found" });
    }
    if (!post.likes) post.likes = [];
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(u => u !== username);
      console.log("Post unliked");
    } else {
      post.likes.push(username);
      console.log("Post liked");
    }

    await post.save();
    res.json({ likes: post.likes, likeCount: post.likes.length });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;