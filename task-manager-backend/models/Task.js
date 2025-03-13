import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User model
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
