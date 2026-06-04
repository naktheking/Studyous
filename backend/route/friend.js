import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/send-request", async (req, res) => {
  try {
    const { fromUsername, toUsername } = req.body;
    const toUser = await User_account.findOne({ username: toUsername });
    const fromUser = await User_account.findOne({ username: fromUsername });

    if (!toUser) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    if (fromUser && fromUser.friendList.includes(toUsername)) {
      console.log("User is already in friend list");
      return res.json({ success: false, message: `${toUsername} is already your friend.` });
    }

    if (toUser.pendingFriendRequests.includes(fromUsername)) {
      console.log("Friend request already sent.");
      return res.json({ success: false, message: "Friend request already sent." });
    }

    // Append fromUsername to toUser's pendingFriendRequests
    toUser.pendingFriendRequests.push(fromUsername);
    await toUser.save(); //ensures friend request is saved in database
    console.log("Friend request sent");
    res.json({ success: true, message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//WHAT IS THIS 
router.get("/get-requests/:username", async (req, res) => {
  try {
    const user = await User_account.findOne({ username: req.params.username });

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("Requests retrieved successfully");
    res.json({ success: true, requests: user.pendingFriendRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-friends/:username", async (req, res) => {
  try {
    const user = await User_account.findOne({ username: req.params.username });

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("Friends retrieved successfully");
    res.json({ success: true, friends: user.friendList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ACCEPT OR REJECT FRIEND REQUEST
router.post("/accept-request", async (req, res) => {
  try {
    const { toUsername, fromUsername } = req.body;
    
    const toUser = await User_account.findOne({ username: toUsername });
    const fromUser = await User_account.findOne({ username: fromUsername });

    if (!toUser || !fromUser) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    // Remove fromUsername from toUser's pendingFriendRequests
    toUser.pendingFriendRequests = toUser.pendingFriendRequests.filter(req => req !== fromUsername);
    
    // Add each other to friend lists
    toUser.friendList.push(fromUsername);
    fromUser.friendList.push(toUsername);

    await toUser.save();
    await fromUser.save();
    console.log("Friend request accepted");
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
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    // Remove fromUsername from toUser's pendingFriendRequests
    toUser.pendingFriendRequests = toUser.pendingFriendRequests.filter(req => req !== fromUsername);

    await toUser.save();

    console.log("Friend request rejected");
    res.json({ success: true, message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;