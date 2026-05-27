import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    date: String,
    startTime: String,
    endTime: String
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    pendingFriendRequests: [String],
    friendList: [String],
    posts: [PostSchema]
  }
);

export default mongoose.model("User_account", UserSchema);
