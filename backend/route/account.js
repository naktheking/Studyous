import express from "express";
import User_account from "../models/user.js";
import user from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingAccount = await User_account.findOne({ username });

    if (existingAccount) {
      return res.status(409).json({ error: "account already created" });
    }
    
    const account = await User_account.create({ username, password });
    return res.status(201).json(account);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


router.get("/get-account", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User_account.findOne({ username });
    if(user){
      res.json(user);
    } else {
      res.json("user not found");
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/remove-account", async (req, res) => {
  try {
    const { username } = req.body;
    const usern = { username };
    
    const existingAccount = await User_account.findOne({ username });

    if (!existingAccount) {
      return res.status(405).json({ error: "account does not exist" });
    }

    const deleteAcc = await User_account.deleteOne({ username: usern.username });
    
    if (!deleteAcc) {
      return res.status(407).json({ error: "account not deleted" });
    }

    return res.status(201).json(existingAccount);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
