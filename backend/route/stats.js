import express from "express";
import User_account from "../models/user.js";
import Post from "../models/post.js";

const router = express.Router();

router.get("/get-posts", async (req, res) => {
  try {
    const { username } = req.query;

    const poster = await User_account.findOne({ username });

    if (!poster) {
      console.log("User not found");
      return res.status(404).json({ error: "user not found" });
    }

    const posts = await Post.find({ person: username });

    console.log("Stats retrieved successfully");
    res.json({ posts });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;