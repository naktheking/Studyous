import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  { username: String, text: String },
  { timestamps: true }
);

const ReactionSchema = new mongoose.Schema(
  { username: String, emoji: String },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    date: String,
    startTime: String,
    endTime: String,
    reactions: { type: [ReactionSchema], default: [] },
    comments:  { type: [CommentSchema],  default: [] },
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
