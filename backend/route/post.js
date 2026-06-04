import express from "express";
import User_account from "../models/user.js";
import { createDateFromMilitaryTime } from "../utils/timeUtils.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const {person, title, location, date, startTime, endTime } = req.body;

    const user = await User_account.findOne({ username: person });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "user not found" });
    }

    // All times are stored in military time format (24-hour: HH:mm)
    // e.g., startTime: "14:30" (2:30 PM), endTime: "16:45" (4:45 PM)
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

    console.log("Posts retrieved successfully");
    res.json(user.posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Manual endpoint to clear old posts on user request
// All times are in military format (HH:mm, 24-hour)
// router.post("/clear-old-posts", async (req, res) => {
//   try {
//     const { username } = req.body;

//     if (!username) {
//       return res.status(400).json({ error: "Username required" });
//     }

//     const user = await User_account.findOne({ username });
//     if (!user) {
//       console.log("User not found");
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Calculate how many posts will be removed
//     const before = user.posts.length;
//     const now = new Date();

//     // Filter posts: keep only those with end times in the future (military time format)
//     user.posts = user.posts.filter(post => {
//       // Times are in military format: HH:mm (e.g., "14:30" means 2:30 PM)
//       const postDateTime = createDateFromMilitaryTime(post.date, post.endTime);
//       return postDateTime > now;
//     });

//     await user.save();
//     const after = user.posts.length;
//     const removed = before - after;

//     console.log(`Cleared ${removed} old posts for user ${username}`);
//     res.json({
//       success: true,
//       message: `Cleared ${removed} old post(s)`,
//       remainingPosts: after,
//       removedPosts: removed
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// Cleanup endpoint called on login - deletes posts older than 1 week
// Only deletes posts where the end time has passed AND the post date is older than 7 days
router.post("/cleanup-old-posts", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    const user = await User_account.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const before = user.posts.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Delete posts that are older than 1 week AND have already ended
    user.posts = user.posts.filter(post => {
      const postDate = new Date(post.date);
      const postDateTime = createDateFromMilitaryTime(post.date, post.endTime);  //This line was written by AI. Refer to prompt 1 in the gen_aI_use.txt file
      
      // Keep the post if:
      // - It hasn't ended yet, OR
      // - It ended but is from the current week
      return postDateTime > now || postDate >= oneWeekAgo;
    });

    await user.save();
    const after = user.posts.length;
    const removed = before - after;

    if (removed > 0) {
      console.log(`Cleanup: Deleted ${removed} posts older than 1 week for user ${username}`);
    }

    res.json({
      success: true,
      removedPosts: removed
    });
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

// Toggle an emoji reaction on a post (one reaction per user; same emoji removes it)
router.post("/react/:ownerUsername/:postId", async (req, res) => {
  try {
    const { ownerUsername, postId } = req.params;
    const { username, emoji } = req.body;

    const user = await User_account.findOne({ username: ownerUsername });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = user.posts.id(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const existingIdx = post.reactions.findIndex(r => r.username === username);
    if (existingIdx !== -1) {
      if (post.reactions[existingIdx].emoji === emoji) {
        post.reactions.splice(existingIdx, 1);
      } else {
        post.reactions[existingIdx].emoji = emoji;
      }
    } else {
      post.reactions.push({ username, emoji });
    }

    await user.save();
    res.json({ reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a post
router.post("/comment/:ownerUsername/:postId", async (req, res) => {
  try {
    const { ownerUsername, postId } = req.params;
    const { username, text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ error: "Comment text required" });

    const user = await User_account.findOne({ username: ownerUsername });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = user.posts.id(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ username, text: text.trim() });
    await user.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment (only the comment's author can delete it)
router.delete("/comment/:ownerUsername/:postId/:commentId", async (req, res) => {
  try {
    const { ownerUsername, postId, commentId } = req.params;
    const { username } = req.body;

    const user = await User_account.findOne({ username: ownerUsername });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = user.posts.id(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.username !== username) return res.status(403).json({ error: "Not your comment" });

    post.comments.pull(commentId);
    await user.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;