import express from "express";
import User_account from "../models/user.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingAccount = await User_account.findOne({ username });

    if (existingAccount) {
      console.log("Account already created");
      return res.status(409).json({ error: "account already created" });
    }
    
    const account = await User_account.create({ username, password });
    res.status(201).json(account);
    console.log("Account created");

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/get-account", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User_account.findOne({ username });
    if(user){
      // Cleanup posts older than 1 week on login
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const initialCount = user.posts.length;
      user.posts = user.posts.filter(post => {
        const postDate = new Date(post.date);
        // Keep posts that haven't ended yet OR are from the current week
        const postEndTime = new Date(`${post.date} ${post.endTime}`);
        return postEndTime > now || postDate >= oneWeekAgo;
      });
      
      // Save if posts were deleted
      if (user.posts.length < initialCount) {
        await user.save();
        console.log(`Cleanup on login: Deleted ${initialCount - user.posts.length} old posts for ${username}`);
      }
      
      console.log("Account found sucessfully");
      res.json(user);
    } else {
      console.log("Account not found");
      res.json("user not found");
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.username}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post("/upload-pic/:username", upload.single("profilePic"), async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User_account.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profilePic = `http://localhost:3000/uploads/${req.file.filename}`;
    await user.save();
    res.json({ profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
