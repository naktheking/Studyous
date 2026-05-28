import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    console.log("got post");
    const {person, title, location, date, startTime, endTime } = req.body;
    
    console.log("Looking for user:", person);
    const user = await User_account.findOne({ username: person });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    user.posts.push({ title, location, date, startTime, endTime });
    await user.save();

    const createdPost = user.posts[user.posts.length - 1];
    res.json(createdPost);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-post", async (req, res) => {
  try {
    const { username, person } = req.query;
    const resolvedUsername = username || person;
    const user = await User_account.findOne({ username: resolvedUsername });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json(user.posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/like-post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!post.likes) post.likes = [];
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(u => u !== username); // unlike
    } else {
      post.likes.push(username); // like
    }

    await post.save();
    res.json({ likes: post.likes, likeCount: post.likes.length });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;