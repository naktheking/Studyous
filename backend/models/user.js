import mongoose from "mongoose";
import Post from "./post.js";


const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    pendingFriendRequests: [String],
    friendList: [String],
    posts: [Post]
  }
);

export default mongoose.model("User_account", UserSchema);
