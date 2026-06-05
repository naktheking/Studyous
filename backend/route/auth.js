import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User_account from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Set up Google OAuth which grabs the client credentials from .env
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = email.split('@')[0];   // Uses the part before @ as the username

    // Find existing user or create a new one on first login
    let user = await User_account.findOne({ username });
    if (!user) {
      user = await User_account.create({
        username,
        password: '',
        googleId: profile.id
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Store just the user's MongoDB _id in the session
passport.serializeUser((user, done) => done(null, user._id));

// Look up the full user from the session _id on each request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User_account.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const router = express.Router();

// Start the Google login flow which requests access to email address
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Sends user back to the frontend with their info
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173" }),
  (req, res) => {
    res.redirect(`http://localhost:5173?user=${req.user.username}&pic=${encodeURIComponent(req.user.profilePic || '')}`);
  }
);

export default router;