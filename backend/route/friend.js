import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/send-request", async (req, res) => {
  try {
    const { fromUsername, toUsername } = req.body;
    const toUser = await User_account.findOne({ username: toUsername });

    if (!toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Append fromUsername to toUser's pendingFriendRequests
    toUser.pendingFriendRequests.push(fromUsername);
    await toUser.save();

    res.json({ success: true, message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-requests/:username", async (req, res) => {
  try {
    const user = await User_account.findOne({ username: req.params.username });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, requests: user.pendingFriendRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-friends/:username", async (req, res) => {
  try {
    const user = await User_account.findOne({ username: req.params.username });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, friends: user.friendList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/accept-request", async (req, res) => {
  try {
    const { toUsername, fromUsername } = req.body;
    
    const toUser = await User_account.findOne({ username: toUsername });
    const fromUser = await User_account.findOne({ username: fromUsername });

    if (!toUser || !fromUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Remove fromUsername from toUser's pendingFriendRequests
    toUser.pendingFriendRequests = toUser.pendingFriendRequests.filter(req => req !== fromUsername);
    
    // Add each other to friend lists
    toUser.friendList.push(fromUsername);
    fromUser.friendList.push(toUsername);

    await toUser.save();
    await fromUser.save();

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reject-request", async (req, res) => {
  try {
    const { toUsername, fromUsername } = req.body;
    
    const toUser = await User_account.findOne({ username: toUsername });

    if (!toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Remove fromUsername from toUser's pendingFriendRequests
    toUser.pendingFriendRequests = toUser.pendingFriendRequests.filter(req => req !== fromUsername);
    
    await toUser.save();

    res.json({ success: true, message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;