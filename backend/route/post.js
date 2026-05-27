import express from "express";
import Post from "../models/post.js";
import User_account from "../models/user.js"

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const { person, title, location, date, startTime, endTime } = req.body;

    const user = await User_account.findOne({
      username: person
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const post = await Post.create({ 
      person: user.username,
      title, 
      location,
      date,
      startTime, 
      endTime
    });

    res.json(post);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-post", async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
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