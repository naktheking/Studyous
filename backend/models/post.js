import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    person: String,
    startTime: Number,
    endTime: Number,
    location: String,
    subject: String,
  },

  {timestamps: true}
);

export default mongoose.model("Post", MessageSchema);
