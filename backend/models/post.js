import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    person: String,
    startTime: String,
    endTime: String,
    location: String,
    date: String,
  },

  {timestamps: true}
);

export default mongoose.model("Post", MessageSchema);
